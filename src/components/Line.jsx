import React, { useRef, useEffect, useState } from "react";

export default function Line({ data, boxes }) {
  const pathRef = useRef();
  const [pathData, setPathData] = useState("");

  useEffect(() => {
    const startBox = boxes.find(box => box.id === data.startBoxId);
    const endBox = boxes.find(box => box.id === data.endBoxId);

    if (startBox && endBox) {
      const startX = startBox.x + 75; // Center of the start box (assuming width = 150)
      const startY = startBox.y + 25; // Center of the start box (assuming height = 50)
      const endX = endBox.x + 75;     // Center of the end box
      const endY = endBox.y + 25;     // Center of the end box

      setPathData(`M${startX},${startY} L${endX},${endY}`);
    }
  }, [data, boxes]);

  return (
    <g className="line-group">
      <path
        ref={pathRef}
        d={pathData}
        stroke="gray"
        fill="none"
        strokeWidth={2}
        cursor="pointer"
      />
    </g>
  );
}