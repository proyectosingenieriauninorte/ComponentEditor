import React, { useState, useEffect } from "react";

export default function Box({ data, updateBoxPosition }) {
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setDragging(true);
    setOffset({
      x: e.clientX - data.x,
      y: e.clientY - data.y,
    });
    e.target.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      const newX = e.clientX - offset.x;
      const newY = e.clientY - offset.y;
      updateBoxPosition(data.id, newX, newY);
    }
  };

  const handleMouseUp = () => {
    if (dragging) {
      setDragging(false);
    }
  };

  useEffect(() => {
    if (dragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  return (
    <>
      {console.log(`Rendering Box ID: ${data.id}, Position: (${data.x}, ${data.y})`)}
      <svg
        x={data.x}  // Ensure this is updating correctly
        y={data.y}  // Ensure this is updating correctly
        width="150"
        height="50"
        onMouseDown={handleMouseDown}
        style={{ cursor: 'grab' }}  // Removed position: absolute
      >
        <rect width="150" height="50" fill="white" stroke="gray" />
        <foreignObject x="0" y="0" width="150" height="50">
          <div className="box-content">
            {data.name}
          </div>
        </foreignObject>
      </svg>
    </>
  );
}
