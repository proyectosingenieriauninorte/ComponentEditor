import React, { Component } from "react";
import Modes from "@/app/Modules/Toolbar/Modes";
import { useEffect } from "react";
import "./box.css";

class Box extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dragging: false,
      offset: { x: 0, y: 0 },
    };

    const { boxData } = this.props;

    const boxWidth = boxData.width / 2;
    const boxHeight = boxData.height / 2;

    this.hookPoints = [
      { id: "top", x: boxWidth, y: 0 },
      { id: "right", x: boxData.width, y: boxHeight },
      { id: "bottom", x: boxWidth, y: boxData.height },
      { id: "left", x: 0, y: boxHeight },
    ];

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
  }

  updateHookPoints() {
    const { boxData } = this.props;
    const boxWidth = boxData.width / 2;
    const boxHeight = boxData.height / 2;
    this.hookPoints = [
      { id: "top", x: boxWidth, y: 0 },
      { id: "right", x: boxData.width, y: boxHeight },
      { id: "bottom", x: boxWidth, y: boxData.height },
      { id: "left", x: 0, y: boxHeight },
    ];
  }

  componentDidUpdate(prevProps) {
    if (prevProps.boxData !== this.props.boxData) {
      this.updateHookPoints();
    }
  }

  handleMouseDown(e) {
    e.preventDefault();
    e.stopPropagation();
    const { selectedTool, boxData, onPointerDown } = this.props;
    if (selectedTool === Modes.SELECT) {
      this.setState({
        dragging: true,
        offset: {
          x: e.clientX - boxData.x,
          y: e.clientY - boxData.y,
        },
      });
      onPointerDown?.(boxData.id, e);
    }
  }

  handleMouseMove(e) {
    const { dragging, offset } = this.state;
    const { selectedTool, boxData, updateBoxPosition, canvasWidth, canvasHeight } = this.props;
    if (dragging && selectedTool === Modes.SELECT) {
      const newX = e.clientX - offset.x;
      const newY = e.clientY - offset.y;
      updateBoxPosition(boxData.id, newX, newY, canvasWidth, canvasHeight);
    }
  }

  handleMouseUp() {
    if (this.state.dragging) {
      this.setState({ dragging: false });
    }
  }

  componentDidMount() {
    document.addEventListener("mousemove", this.handleMouseMove);
    document.addEventListener("mouseup", this.handleMouseUp);
  }

  componentWillUnmount() {
    document.removeEventListener("mousemove", this.handleMouseMove);
    document.removeEventListener("mouseup", this.handleMouseUp);
  }

  render() {
    const { boxData, selectedTool, onHookClick } = this.props;

    return (
      <svg
        x={boxData.x}
        y={boxData.y}
        width={boxData.width}
        height={boxData.height}
        onMouseDown={this.handleMouseDown}
        style={{
          position: "absolute",
          left: boxData.x,
          top: boxData.y,
          cursor: selectedTool === Modes.SELECT ? "move" : "default",
        }}
      >
        <foreignObject
          width={boxData.width}
          height={boxData.height}
          className={`box-container ${boxData.selected ? "selected" : ""}`}
        >
          <div>
            <div className="box-header" style={{ backgroundColor: boxData.color }} />
            <div className="box-content">
              <div>{boxData.name}</div>
            </div>
          </div>
        </foreignObject>

        {boxData.selected && (
          <>
            <rect x={0} y={0} width={8} height={8} fill="blue" className="corner top-left" />
            <rect x={boxData.width - 8} y={0} width={8} height={8} fill="blue" className="corner top-right" />
            <rect x={0} y={boxData.height - 8} width={8} height={8} fill="blue" className="corner bottom-left" />
            <rect x={boxData.width - 8} y={boxData.height - 8} width={8} height={8} fill="blue" className="corner bottom-right" />
          </>
        )}

        {selectedTool === Modes.NEW_LINE &&
          this.hookPoints.map((point) => (
            <circle
              key={point.id}
              cx={point.x}
              cy={point.y}
              r="5"
              fill="blue"
              onClick={(e) => {
                e.stopPropagation();
                onHookClick(boxData.id, point.id);
              }}
              style={{ cursor: "crosshair" }}
            />
          ))}
      </svg>
    );
  }
}

export default React.memo(Box);