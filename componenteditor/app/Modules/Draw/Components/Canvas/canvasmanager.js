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
  }

  setCanvasRect(rect) {
    this.state.canvasRect = rect;
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