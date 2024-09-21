// Canvas.jsx
import React, { Component, createRef } from "react";
import Box from "../Box";
import Line from "../Line";
import Modes from "@/app/Modules/Toolbar/Modes";
import "./canvas.css";
import CanvasManager from "./canvasmanager"; 

class Canvas extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = createRef();
    this.canvasManager = new CanvasManager();
  }

  componentDidMount() {
    this.canvasManager.initialize(this.canvasRef, this.props);
  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      this.canvasManager.props = this.props;
    }
  }

  componentWillUnmount() {
    this.canvasManager.cleanup();
  }

  render() {
    const { selectedTool, boxes, lines, updateBoxPosition, deleteBox: deleteBoxCallback } = this.props;
    const { tempBox, canvasRect } = this.canvasManager.state;

    return (
      <div
        ref={this.canvasRef}
        className="canvas"
        onMouseEnter={this.canvasManager.handleMouseEnter}
        onClick={this.canvasManager.handleCanvasClick}
        style={{ position: "relative", width: "100%", height: "100%" }}
      >
        {boxes.map((box) => (
          <Box
            key={box.id}
            boxData={box}
            onPointerDown={(e) => this.canvasManager.handleBoxClick(box.id, e)}
            updateBoxPosition={updateBoxPosition}
            deleteBox={deleteBoxCallback}
            selectedTool={selectedTool}
            onHookClick={this.canvasManager.handleHookClick}
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
