import React, { useState } from "react";

export default function Box({ data, updateBoxPosition }) {
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setDragging(true);
    setOffset({
      x: e.clientX - data.x,
      y: e.clientY - data.y,
    });
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      const newX = e.clientX - offset.x;
      const newY = e.clientY - offset.y;
      updateBoxPosition(data.id, newX, newY);
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  return (
    <svg
      x={data.x}
      y={data.y}
      width="150"
      height="50"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{ cursor: 'pointer' }}
    >
      <rect width="150" height="50" fill="white" stroke="gray" />
      <foreignObject x="0" y="0" width="150" height="50">
        <div className="box-content">
          {data.name}
        </div>
      </foreignObject>
    </svg>
  );
}
