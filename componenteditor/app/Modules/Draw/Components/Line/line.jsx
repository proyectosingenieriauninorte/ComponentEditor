import "./line.css";
import React, { Component } from "react";

class Line extends Component {
  constructor(props) {
    super(props);
    const { data, boxes } = this.props;
    const { startBoxId, endBoxId, startHook, endHook } = data;
    const startBox = boxes.find((box) => box.id === startBoxId);
    const endBox = boxes.find((box) => box.id === endBoxId);



    
    this.hookOffsets = {
      StartOffsets: {
        top: { x: startBox.width / 2, y: 0 },
        right: { x: startBox.width, y: startBox.height / 2 },
        bottom: { x: startBox.width / 2, y: startBox.height },
        left: { x: 0, y: startBox.height / 2 },
      },
      EndOffsets: {
      top: { x: endBox.width / 2, y: 0 },
      right: { x: endBox.width, y: endBox.height / 2 },
      bottom: { x: endBox.width / 2, y: endBox.height },
      left: { x: 0, y: endBox.height / 2 },
      }
    };
    this.getPerpendicularSegment = this.getPerpendicularSegment.bind(this);
  }



  getPerpendicularSegment(hook, x, y) {
    switch (hook) {
      case "top":
        return `L ${x},${y - 20} `;
      case "bottom":
        return `L ${x},${y + 20} `;
      case "left":
        return `L ${x - 20},${y} `;
      case "right":
        return `L ${x + 20},${y} `;
      default:
        return "";
    }
  }

  render() {
    const { data, boxes } = this.props;
    const { startBoxId, endBoxId, startHook, endHook } = data;
    const startBox = boxes.find((box) => box.id === startBoxId);
    const endBox = boxes.find((box) => box.id === endBoxId);

    if (!startBox || !endBox) {
      console.error("Start or End Box not found", { startBox, endBox });
      return null;
    }

    if (!this.hookOffsets.StartOffsets[startHook] || !this.hookOffsets.EndOffsets[endHook]) {
      console.error("Invalid startHook or endHook", { startHook, endHook });
      return null;
    }
    console.log(`Line from ${startBoxId} to ${endBoxId} from ${startHook} to ${endHook}`);
    console.log("StartOffsets", this.hookOffsets.StartOffsets);
    console.log("EndOffsets", this.hookOffsets.EndOffsets);
    const startX = startBox.x + this.hookOffsets.StartOffsets[startHook].x;
    const startY = startBox.y + this.hookOffsets.StartOffsets[startHook].y;
    const endX = endBox.x + this.hookOffsets.EndOffsets[endHook].x;
    const endY = endBox.y + this.hookOffsets.EndOffsets[endHook].y;

    const pathD = `
      M ${startX},${startY} 
      ${this.getPerpendicularSegment(startHook, startX, startY)}
      ${this.getPerpendicularSegment(endHook, endX, endY)}
      L ${endX},${endY}
    `;

    return (
      <svg style={{ position: "absolute", overflow: "visible" }}>
        <g>
          <path d={pathD} stroke="gray" strokeWidth="2" fill="none" />
        </g>
      </svg>
    );
  }
}

export default React.memo(Line);