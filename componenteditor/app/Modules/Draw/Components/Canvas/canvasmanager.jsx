// CanvasManager.jsx
import { createRef } from "react";
import Modes from "@/app/Modules/Toolbar/Modes";

class CanvasManager {
  constructor() {
    this.canvasRef = createRef();
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
    this.onStateChange = null; // Callback for state changes
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    if (this.onStateChange) {
      this.onStateChange();
    }
  }

  initialize(canvasRef, props) {
    this.canvasRef = canvasRef;
    this.props = props;
    this.updateCanvasRect();
    document.addEventListener("mousemove", this.handleMouseMove);
    document.addEventListener("mouseup", this.handleMouseUp);
    window.addEventListener("keydown", this.handleKeyDown);
  }

  updateCanvasRect() {
    if (this.canvasRef.current) {
      this.setState({ canvasRect: this.canvasRef.current.getBoundingClientRect() });
    }
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

    this.setState({ boxes: [...this.state.boxes, newBox] });
    console.log(`Added Box ID: ${newBox.id}, Position: (${newBox.x}, ${newBox.y})`);
  }

  updateBoxPosition(id, x, y, canvasWidth, canvasHeight) {
    const snappedX = this.snapToGrid(x);
    const snappedY = this.snapToGrid(y);

    this.setState({
      boxes: this.state.boxes.map((box) =>
        box.id === id
          ? {
              ...box,
              x: Math.max(0, Math.min(snappedX, canvasWidth - box.width)),
              y: Math.max(0, Math.min(snappedY, canvasHeight - box.height)),
            }
          : box
      ),
    });
  }

  updateBox(id, updatedProperties) {
    this.setState({
      boxes: this.state.boxes.map((box) =>
        box.id === id ? { ...box, ...updatedProperties } : box
      ),
    });
  }

  deleteBox(id) {
    console.log(`Deleting Box with ID: ${id}`);
    this.setState({ boxes: this.state.boxes.filter((box) => box.id !== id) });
  }

  addLine({ startBoxId, endBoxId, startHook, endHook }) {
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

    this.setState({ lines: [...this.state.lines, newLine] });
    console.log(`Added Line ID: ${newLine.id} between boxes ${startBoxId} and ${endBoxId}`);
  }

  selectBox(id) {
    this.setState({
      boxes: this.state.boxes.map((box) => ({ ...box, selected: box.id === id })),
    });
  }

  handleMouseEnter = (e) => {
    const { selectedTool } = this.props;
    const { tempBox } = this.state;
    if (selectedTool === Modes.NEW_BOX && !tempBox) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this.setState({ canvasRect: rect });
      this.setState({
        tempBox: {
          id: "temp",
          x,
          y,
          name: "New Box",
          color: "#ffffff",
        },
      });
    }
  };

  handleMouseMove = (e) => {
    const { tempBox, canvasRect } = this.state;
    if (tempBox && canvasRect) {
      let x = e.clientX - canvasRect.left;
      let y = e.clientY - canvasRect.top;
      x = Math.max(0, Math.min(x, canvasRect.width - 150));
      y = Math.max(0, Math.min(y, canvasRect.height - 50));
      this.setState({ tempBox: { ...tempBox, x, y } });
    }
  };

  handleCanvasClick = (e) => {
    e.preventDefault();
    this.props.clearSelection();
  };

  handleBoxClick = (boxId, e) => {
    const { selectedTool, onSelectBox } = this.props;
    if (selectedTool === Modes.SELECT) {
      this.setState({ selectedBoxId: boxId });
      onSelectBox(boxId);
    }
  };

  handleMouseUp = (e) => {
    const { tempBox, canvasRect } = this.state;
    const { addBox: addBoxCallback } = this.props;
    if (tempBox && canvasRect) {
      let x = e.clientX - canvasRect.left;
      let y = e.clientY - canvasRect.top;
      x = Math.max(0, Math.min(x, canvasRect.width - 150));
      y = Math.max(0, Math.min(y, canvasRect.height - 50));
      addBoxCallback(x, y);
      this.setState({ tempBox: null });
    }
  };

  handleHookClick = (boxId, hookPointId) => {
    const { selectedTool, onAddLine } = this.props;
    const { lineStart } = this.state;
    if (selectedTool === Modes.NEW_LINE) {
      if (lineStart) {
        onAddLine(lineStart.boxId, boxId, lineStart.hookPointId, hookPointId);
        this.setState({ lineStart: null });
      } else {
        this.setState({ lineStart: { boxId, hookPointId } });
      }
    }
  };

  handleKeyDown = (e) => {
    const { deleteBox: deleteBoxCallback, clearSelection } = this.props;
    const { selectedBoxId } = this.state;
    if (e.key === 'Delete' && selectedBoxId !== null) {
      deleteBoxCallback(selectedBoxId);
      this.setState({ selectedBoxId: null });
    }
    if (e.key === 'Escape') {
      clearSelection();
    }
  };

  cleanup() {
    window.removeEventListener("keydown", this.handleKeyDown);
    document.removeEventListener("mousemove", this.handleMouseMove);
    document.removeEventListener("mouseup", this.handleMouseUp);
  }
}

export default CanvasManager;
