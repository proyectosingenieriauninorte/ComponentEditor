import "./Line.css";
import React from "react";

// Memoized Line component to avoid unnecessary re-renders
const Line = React.memo(({ data, boxes }) => {
  const { startBoxId, endBoxId, startHook, endHook } = data;
  const startBox = boxes.find(box => box.id === startBoxId);
  const endBox = boxes.find(box => box.id === endBoxId);

  if (!startBox || !endBox) {
    console.error("Start or End Box not found", { startBox, endBox });
    return null;
  }

  const hookOffsets = {
    top: { x: 75, y: 0 },
    right: { x: 150, y: 25 },
    bottom: { x: 75, y: 50 },
    left: { x: 0, y: 25 },
  };

  if (!hookOffsets[startHook] || !hookOffsets[endHook]) {
    console.error("Invalid startHook or endHook", { startHook, endHook });
    return null;
  }

  const startX = startBox.x + hookOffsets[startHook].x;
  const startY = startBox.y + hookOffsets[startHook].y;
  const endX = endBox.x + hookOffsets[endHook].x;
  const endY = endBox.y + hookOffsets[endHook].y;

  // Calculate the perpendicular segment based on hook point
  const getPerpendicularSegment = (hook, x, y) => {
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
  };

  // Build the path with the calculated segments
  const pathD = `
    M ${startX},${startY} 
    ${getPerpendicularSegment(startHook, startX, startY)}
    ${getPerpendicularSegment(endHook, endX, endY)}
    L ${endX},${endY}
  `;

  return (
    <svg style={{ position: "absolute", overflow: "visible" }}>
      <g>
        <path d={pathD} stroke="gray" strokeWidth="2" fill="none" />
      </g>
    </svg>
  );
});

export default Line;
