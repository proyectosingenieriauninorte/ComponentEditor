import React, { useState, useRef, useEffect } from "react";
import Modes from "../modes";

export default function Box(props) {
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const {
    boxData,
    onPointerDown,
    updateBoxPosition,
    deleteBox,
    selectedTool,
    onHookClick, // Ensure this prop is passed
  } = props;

  const hookPoints = [
    { id: 'top', x: 75, y: 0 }, // Top center
    { id: 'right', x: 150, y: 25 }, // Right center
    { id: 'bottom', x: 75, y: 50 }, // Bottom center
    { id: 'left', x: 0, y: 25 } // Left center
  ];

  const handleMouseDown = (e) => {
    // Prevent default behavior and stop propagation
    e.preventDefault();
    e.stopPropagation();
    if (selectedTool === Modes.SELECT) {
      setDragging(true);
      setOffset({
        x: e.clientX - boxData.x,
        y: e.clientY - boxData.y,
      });
      if (onPointerDown) onPointerDown(boxData.id); // Notify parent that this box is selected
    }
  };

  const handleMouseMove = (e) => {
    if (dragging && selectedTool === Modes.SELECT) {
      const newX = e.clientX - offset.x;
      const newY = e.clientY - offset.y;
      updateBoxPosition(boxData.id, newX, newY);
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
  }, [dragging,selectedTool]);

  return (
    <svg
      x={boxData.x}
      y={boxData.y}
      width="150"
      height="50"
      onMouseDown={handleMouseDown}
      style={{ position: 'absolute', left: boxData.x, top: boxData.y, cursor: selectedTool === Modes.SELECT ? 'move' : 'default' }}
    >
      <foreignObject
        width="150"
        height="50"
        className={`box-container ${boxData.selected ? 'selected' : ''}`}
      >
        <div>
          <div className="box-header" style={{ backgroundColor: boxData.color }} />
          <div className="box-content">
            <div>{boxData.name}</div>
          </div>
        </div>
      </foreignObject>

      {selectedTool === Modes.NEW_LINE && hookPoints.map(point => (
        <circle
          key={point.id}
          cx={point.x}
          cy={point.y}
          r="5"
          fill="blue"
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering box click
            onHookClick(boxData.id, point.id);
          }}
          style={{ cursor: 'crosshair' }} // Cursor changes only over hook points
        />
      ))}

    </svg>
  );
}
