import React from "react";

export default function Line({ data, boxes }) {
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
    left: { x: 0, y: 25 }
  };

  if (!hookOffsets[startHook] || !hookOffsets[endHook]) {
    console.error("Invalid startHook or endHook", { startHook, endHook });
    return null;
  }

  const startX = startBox.x + hookOffsets[startHook].x;
  const startY = startBox.y + hookOffsets[startHook].y;
  const endX = endBox.x + hookOffsets[endHook].x;
  const endY = endBox.y + hookOffsets[endHook].y;

  let pathD = `M ${startX},${startY} `;

  // Add perpendicular segment based on hook point for the start of the line
  if (startHook === 'top') {
    pathD += `L ${startX},${startY - 20} `;
  } else if (startHook === 'bottom') {
    pathD += `L ${startX},${startY + 20} `;
  } else if (startHook === 'left') {
    pathD += `L ${startX - 20},${startY} `;
  } else if (startHook === 'right') {
    pathD += `L ${startX + 20},${startY} `;
  }

  // Add perpendicular segment based on hook point for the end of the line
  if (endHook === 'top') {
    pathD += `L ${endX},${endY - 20} `;
  } else if (endHook === 'bottom') {
    pathD += `L ${endX},${endY + 20} `;
  } else if (endHook === 'left') {
    pathD += `L ${endX - 20},${endY} `;
  } else if (endHook === 'right') {
    pathD += `L ${endX + 20},${endY} `;
  }

  // Connect the perpendicular segments with a straight line
  pathD += `L ${endX},${endY}`;

  return (
    <svg style={{ position: 'absolute', overflow: 'visible' }}>
      <g>
        <path
          d={pathD}
          stroke="gray"
          strokeWidth="2"
          fill="none"
        />
      </g>
    </svg>
  );
}
