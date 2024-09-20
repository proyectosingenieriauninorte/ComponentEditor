import "./line.css";
import React, { Component } from "react";

class Line extends Component {
  constructor(props) {
    super(props);

    this.hookOffsets = {
      top: { x: 75, y: 0 },
      right: { x: 150, y: 25 },
      bottom: { x: 75, y: 50 },
      left: { x: 0, y: 25 },
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

    if (!this.hookOffsets[startHook] || !this.hookOffsets[endHook]) {
      console.error("Invalid startHook or endHook", { startHook, endHook });
      return null;
    }

    const startX = startBox.x + this.hookOffsets[startHook].x;
    const startY = startBox.y + this.hookOffsets[startHook].y;
    const endX = endBox.x + this.hookOffsets[endHook].x;
    const endY = endBox.y + this.hookOffsets[endHook].y;

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