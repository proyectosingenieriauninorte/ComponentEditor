import React from "react";

export default function Line({ data, boxes }) {
  const { startBoxId, endBoxId } = data;
  const startBox = boxes.find(box => box.id === startBoxId);
  const endBox = boxes.find(box => box.id === endBoxId);

  if (!startBox || !endBox) {
    return null;
  }

  const startX = startBox.x + 75; // Assuming the box width is 150px, this centers the line
  const startY = startBox.y + 25; // Assuming the box height is 50px, this centers the line
  const endX = endBox.x + 75;
  const endY = endBox.y + 25;

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
