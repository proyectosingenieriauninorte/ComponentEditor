import React, { Component, createRef } from "react";
import Box from "../Box";
import Line from "../Line";
import Modes from "@/app/Modules/Toolbar/Modes";
import "./canvas.css";

class Canvas extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = createRef();
    this.state = {
      selectedBoxId: null,
      lineStartBoxId: null,
      tempBox: null,
      canvasRect: null,
      lineStart: null,
    };
  }

  handleMouseEnter = (e) => {
    const { selectedTool } = this.props;
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
      this.setState((prevState) => ({
        tempBox: { ...prevState.tempBox, x, y },
      }));
    }
  };

  handleCanvasClick = (e) => {
    e.preventDefault();
    this.props.clearSelection();
  };

  handleBoxClick = (boxId, e) => {
    e.stopPropagation();
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

  componentDidMount() {
    document.addEventListener("mousemove", this.handleMouseMove);
    document.addEventListener("mouseup", this.handleMouseUp);

    if (this.canvasRef.current) {
      this.setState({ canvasRect: this.canvasRef.current.getBoundingClientRect() });
    }

    window.addEventListener("keydown", this.handleKeyDown);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.tempBox && !prevState.tempBox) {
      document.addEventListener("mousemove", this.handleMouseMove);
      document.addEventListener("mouseup", this.handleMouseUp);
    } else if (!this.state.tempBox && prevState.tempBox) {
      document.removeEventListener("mousemove", this.handleMouseMove);
      document.removeEventListener("mouseup", this.handleMouseUp);
    }
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeyDown);
    document.removeEventListener("mousemove", this.handleMouseMove);
    document.removeEventListener("mouseup", this.handleMouseUp);
  }

  handleKeyDown = (e) => {
    const { deleteBox: deleteBoxCallback, clearSelection } = this.props;
    const { selectedBoxId } = this.state;
    if ((e.key === 'Delete' || e.key === 'Backspace') && selectedBoxId !== null) {
      deleteBoxCallback(selectedBoxId);
      this.setState({ selectedBoxId: null });
    }
    if (e.key === 'Escape') {
      clearSelection();
    }
  };

  render() {
    const { selectedTool, boxes, lines, updateBoxPosition, deleteBox: deleteBoxCallback } = this.props;
    const { tempBox, canvasRect } = this.state;

    return (
      <div
        ref={this.canvasRef}
        className="canvas"
        onMouseEnter={this.handleMouseEnter}
        onClick={this.handleCanvasClick}
        style={{ position: "relative", width: "100%", height: "100%" }}
      >
        {boxes.map((box) => (
          <Box
            key={box.id}
            boxData={box}
            onPointerDown={(e) => this.handleBoxClick(box.id, e)}
            updateBoxPosition={updateBoxPosition}
            deleteBox={deleteBoxCallback}
            selectedTool={selectedTool}
            onHookClick={this.handleHookClick}
            canvasWidth={canvasRect ? canvasRect.width : 0}
            canvasHeight={canvasRect ? canvasRect.height : 0}
          />
        ))}
        {lines.map((line) => (
          <Line key={line.id} data={line} boxes={boxes} />
        ))}

        {tempBox && (
          <Box
            boxData={tempBox}
            selectedTool={selectedTool}
            updateBoxPosition={() => {}}
            onPointerDown={() => {}}
            onHookClick={() => {}}
            deleteBox={() => {}}
            canvasWidth={canvasRect ? canvasRect.width : 0}
            canvasHeight={canvasRect ? canvasRect.height : 0}
          />
        )}
      </div>
    );
  }
}

export default Canvas;
