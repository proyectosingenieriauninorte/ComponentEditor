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
      hookPoints: [],
    };

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
  }

  updateHookPoints() {
    const { boxData } = this.props;
    const boxWidth = boxData.width;
    const boxHeight = boxData.height;
    
    const hookPoints = [];
    const hookCount = boxData.inputs + boxData.outputs;

    for (let i = 0; i < hookCount; i++) {
      const angle = (i / hookCount) * 2 * Math.PI;
      const x = boxWidth / 2 + (boxWidth / 2) * Math.cos(angle);
      const y = boxHeight / 2 + (boxHeight / 2) * Math.sin(angle);
      
      hookPoints.push({
        id: `hook${i + 1}`,
        x: x,
        y: y,
        type: i < boxData.inputs ? 'input' : 'output'
      });
    }


    this.setState({ hookPoints });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.boxData !== this.props.boxData || prevProps.selectedTool !== this.props.selectedTool) {
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
    console.log("Box component mounted");
    this.updateHookPoints();
    document.addEventListener("mousemove", this.handleMouseMove);
    document.addEventListener("mouseup", this.handleMouseUp);
  }

  componentWillUnmount() {
    document.removeEventListener("mousemove", this.handleMouseMove);
    document.removeEventListener("mouseup", this.handleMouseUp);
  }

  render() {
    const { boxData, selectedTool, onHookClick } = this.props;
    const { hookPoints } = this.state;

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

        {selectedTool === Modes.NEW_LINE && hookPoints.map((point) => (
          <circle
            key={point.id}
            cx={point.x}
            cy={point.y}
            r="5"
            fill="blue"
            onClick={(e) => {
              e.stopPropagation();
              console.log(`Hook clicked: Box ${boxData.id}, Hook ${point.id}`);
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