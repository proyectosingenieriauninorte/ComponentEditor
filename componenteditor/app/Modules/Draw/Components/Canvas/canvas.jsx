import React, { Component, createRef } from "react";
import Box from "../Box";
import Line from "../Line";
import Modes from "@/app/Modules/Toolbar/Modes";
import CanvasManager from "./canvasmanager";
import "./canvas.css";

class Canvas extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = createRef();
    this.canvasManager = new CanvasManager();
    this.state = this.canvasManager.state;
  }

  componentDidMount() {
    document.addEventListener("mousemove", this.handleMouseMove);
    document.addEventListener("mouseup", this.handleMouseUp);
    if (this.canvasRef.current) {
      this.canvasManager.setCanvasRect(this.canvasRef.current.getBoundingClientRect());
    }
    window.addEventListener("keydown", this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeyDown);
    document.removeEventListener("mousemove", this.handleMouseMove);
    document.removeEventListener("mouseup", this.handleMouseUp);
  }

  handleMouseEnter = (e) => {
    this.canvasManager.handleMouseEnter(e, this.props.selectedTool);
    this.setState(this.canvasManager.state);
  };

  handleMouseMove = (e) => {
    this.canvasManager.handleMouseMove(e);
    this.setState(this.canvasManager.state);
  };

  handleMouseUp = (e) => {
    this.canvasManager.handleMouseUp(e, this.props.addBox);
    this.setState(this.canvasManager.state);
  };

  handleBoxClick = (boxId, e) => {
    this.canvasManager.handleBoxClick(boxId, this.props.selectedTool, this.props.onSelectBox);
    this.setState(this.canvasManager.state);
  };

  handleHookClick = (boxId, hookPointId) => {
    this.canvasManager.handleHookClick(boxId, hookPointId, this.props.selectedTool, this.props.onAddLine);
    this.setState(this.canvasManager.state);
  };

  handleKeyDown = (e) => {
    this.canvasManager.handleKeyDown(e, this.props.deleteBox, this.props.clearSelection);
    this.setState(this.canvasManager.state);
  };

  render() {
    const { selectedTool, boxes, lines, updateBoxPosition, deleteBox: deleteBoxCallback } = this.props;
    const { tempBox, canvasRect } = this.state;

    return (
      <div
        ref={this.canvasRef}
        className="canvas"
        onMouseEnter={this.handleMouseEnter}
        onClick={this.props.clearSelection}
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
