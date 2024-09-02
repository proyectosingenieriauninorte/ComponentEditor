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

  console.log(`Drawing line from (${startX}, ${startY}) to (${endX}, ${endY})`);

  return (
    <svg style={{ position: 'absolute', overflow: 'visible' }}>
      <g>
        <path
          d={`M ${startX},${startY} L ${endX},${endY}`}
          stroke="gray"
          strokeWidth="2"
          fill="none"
        />
      </g>
    </svg>
  );
}
