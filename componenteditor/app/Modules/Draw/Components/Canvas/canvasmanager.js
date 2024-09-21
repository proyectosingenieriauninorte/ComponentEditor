import Modes from "@/app/Modules/Toolbar/Modes";

class CanvasManager {
  constructor() {
    this.state = {
      selectedBoxId: null,
      lineStartBoxId: null,
      tempBox: null,
      canvasRect: null,
      lineStart: null,
      boxes: [],
      lines: [],
    };
    this.gridSize = 20;
  }

  setCanvasRect(rect) {
    this.state.canvasRect = rect;
  }

  snapToGrid(value) {
    return Math.round(value / this.gridSize) * this.gridSize;
  }

  isPositionValid(x, y, width, height) {
    return !this.state.boxes.some(
      (box) =>
        x < box.x + box.width &&
        x + width > box.x &&
        y < box.y + box.height &&
        y + height > box.y
    );
  }

  findNearestValidPosition(x, y, width, height) {
    const offsets = [
      { dx: 0, dy: 0 },
      { dx: this.gridSize, dy: 0 },
      { dx: -this.gridSize, dy: 0 },
      { dx: 0, dy: this.gridSize },
      { dx: 0, dy: -this.gridSize },
      { dx: this.gridSize, dy: this.gridSize },
      { dx: -this.gridSize, dy: this.gridSize },
      { dx: this.gridSize, dy: -this.gridSize },
      { dx: -this.gridSize, dy: -this.gridSize },
    ];

    for (let i = 0; i < 50; i++) {
      for (const offset of offsets) {
        const newX = x + offset.dx * i;
        const newY = y + offset.dy * i;
        if (this.isPositionValid(newX, newY, width, height)) {
          return { x: newX, y: newY };
        }
      }
    }
    return { x, y };
  }

  addBox(x, y, width = 150, height = 50, color = '#f00') {
    const snappedX = this.snapToGrid(x);
    const snappedY = this.snapToGrid(y);

    let finalPosition = { x: snappedX, y: snappedY };
    if (!this.isPositionValid(snappedX, snappedY, width, height)) {
      finalPosition = this.findNearestValidPosition(snappedX, snappedY, width, height);
      console.log(`Box moved to nearest valid position at (${finalPosition.x}, ${finalPosition.y}).`);
    }

    const newBox = {
      id: this.state.boxes.length + 1,
      name: `Box ${this.state.boxes.length + 1}`,
      x: finalPosition.x,
      y: finalPosition.y,
      width,
      height,
      color,
      selected: false,
    };

    this.state.boxes = [...this.state.boxes, newBox];
    console.log(`Added Box ID: ${newBox.id}, Position: (${newBox.x}, ${newBox.y})`);
  }

  updateBoxPosition(id, x, y, canvasWidth, canvasHeight) {
    const snappedX = this.snapToGrid(x);
    const snappedY = this.snapToGrid(y);

    this.state.boxes = this.state.boxes.map((box) =>
      box.id === id
        ? {
            ...box,
            x: Math.max(0, Math.min(snappedX, canvasWidth - box.width)),
            y: Math.max(0, Math.min(snappedY, canvasHeight - box.height)),
          }
        : box
    );
  }

  updateBox(id, updatedProperties) {
    this.state.boxes = this.state.boxes.map((box) =>
      box.id === id ? { ...box, ...updatedProperties } : box
    );
  }

  deleteBox(id) {
    console.log(`Deleting Box with ID: ${id}`);
    this.state.boxes = this.state.boxes.filter((box) => box.id !== id);
  }

  addLine(startBoxId, endBoxId, startHook, endHook) {
    if (!startBoxId || !endBoxId || !startHook || !endHook) {
      console.error("Invalid parameters for adding a line", { startBoxId, endBoxId, startHook, endHook });
      return;
    }

    const newLine = {
      id: this.state.lines.length + 1,
      startBoxId,
      endBoxId,
      startHook,
      endHook,
    };

    this.state.lines = [...this.state.lines, newLine];
    console.log(`Added Line ID: ${newLine.id} between boxes ${startBoxId} and ${endBoxId}`);
  }

  selectBox(id) {
    this.state.boxes = this.state.boxes.map((box) => ({ ...box, selected: box.id === id }));
  }

  handleMouseEnter(e, selectedTool) {
    const { tempBox } = this.state;
    if (selectedTool === Modes.NEW_BOX && !tempBox) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this.state.canvasRect = rect;
      this.state.tempBox = {
        id: "temp",
        x,
        y,
        width: 150,
        height: 50,
        name: "Newest! Box",
        color: "#ffffff",
      };
    }
  }

  handleMouseMove(e) {
    const { tempBox, canvasRect } = this.state;
    if (tempBox && canvasRect) {
      let x = e.clientX - canvasRect.left;
      let y = e.clientY - canvasRect.top;
      x = Math.max(0, Math.min(x, canvasRect.width - 150));
      y = Math.max(0, Math.min(y, canvasRect.height - 50));
      this.state.tempBox = { ...tempBox, x, y };
    }
  }

  handleMouseUp(e, addBoxCallback) {
    const { tempBox, canvasRect } = this.state;
    if (tempBox && canvasRect) {
      let x = e.clientX - canvasRect.left;
      let y = e.clientY - canvasRect.top;
      x = Math.max(0, Math.min(x, canvasRect.width - 150));
      y = Math.max(0, Math.min(y, canvasRect.height - 50));
      addBoxCallback(x, y);
      this.state.tempBox = null;
    }
  }

  handleBoxClick(boxId, selectedTool, onSelectBox) {
    if (selectedTool === Modes.SELECT) {
      this.state.selectedBoxId = boxId;
      onSelectBox(boxId);
    }
  }

  handleHookClick(boxId, hookPointId, selectedTool, onAddLine) {
    const { lineStart } = this.state;
    if (selectedTool === Modes.NEW_LINE) {
      if (lineStart) {
        onAddLine(lineStart.boxId, boxId, lineStart.hookPointId, hookPointId);
        this.state.lineStart = null;
      } else {
        this.state.lineStart = { boxId, hookPointId };
      }
    }
  }

  handleKeyDown(e, deleteBoxCallback, clearSelection) {
    const { selectedBoxId } = this.state;
    if (e.key === "Delete" && selectedBoxId !== null) {
      deleteBoxCallback(selectedBoxId);
      this.state.selectedBoxId = null;
    }
    if (e.key === "Escape") {
      clearSelection();
    }
  }
}

export default CanvasManager;