import React, { Component } from "react";
import Modes from "@/app/Modules/Toolbar/Modes";

class CanvasManager extends Component {
  constructor(props) {
    super(props);
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

  setCanvasRect = (rect) => {
    this.setState({ canvasRect: rect });
  };

  handleMouseEnter = (e, selectedTool) => {
    const { tempBox } = this.state;
    if (selectedTool === Modes.NEW_BOX && !tempBox) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this.setState({
        canvasRect: rect,
        tempBox: {
          id: "temp",
          x,
          y,
          width: 150,
          height: 50,
          name: "Newest! Box",
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

  handleMouseUp = (e, addBoxCallback) => {
    const { tempBox, canvasRect } = this.state;
    if (tempBox && canvasRect) {
      let x = e.clientX - canvasRect.left;
      let y = e.clientY - canvasRect.top;
      x = Math.max(0, Math.min(x, canvasRect.width - 150));
      y = Math.max(0, Math.min(y, canvasRect.height - 50));
      addBoxCallback(x, y);
      this.setState({ tempBox: null });
    }
  };

  handleBoxClick = (boxId, selectedTool, onSelectBox) => {
    if (selectedTool === Modes.SELECT) {
      this.setState({ selectedBoxId: boxId });
      onSelectBox(boxId);
    }
  };

  handleHookClick = (boxId, hookPointId, selectedTool, onAddLine) => {
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

  handleKeyDown = (e, deleteBoxCallback, clearSelection) => {
    const { selectedBoxId } = this.state;
    if (e.key === "Delete" && selectedBoxId !== null) {
      deleteBoxCallback(selectedBoxId);
      this.setState({ selectedBoxId: null });
    }
    if (e.key === "Escape") {
      clearSelection();
    }
  };

  render() {
    return null; // No render
  }
}

export default CanvasManager;