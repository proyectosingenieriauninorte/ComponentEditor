import React, { useState, useCallback, useEffect } from "react";
import Modes from "@/app/Modules/Toolbar/Modes";
import "./box.css";


const Box = React.memo(function Box({
  boxData,
  onPointerDown,
  updateBoxPosition,
  deleteBox,
  selectedTool,
  onHookClick,
  canvasWidth,
  canvasHeight,
}) {
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const hookPoints = [
    { id: "top", x: 75, y: 0 },
    { id: "right", x: 150, y: 25 },
    { id: "bottom", x: 75, y: 50 },
    { id: "left", x: 0, y: 25 },
  ];

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (selectedTool === Modes.SELECT) {
      setDragging(true);
      setOffset({
        x: e.clientX - boxData.x,
        y: e.clientY - boxData.y,
      });
      onPointerDown?.(boxData.id, e);
    }
  }, [boxData, selectedTool, onPointerDown]);

  const handleMouseMove = useCallback(
    (e) => {
      if (dragging && selectedTool === Modes.SELECT) {
        const newX = e.clientX - offset.x;
        const newY = e.clientY - offset.y;
        updateBoxPosition(boxData.id, newX, newY, canvasWidth, canvasHeight);
      }
    },
    [dragging, offset, boxData, selectedTool, updateBoxPosition, canvasWidth, canvasHeight]
  );

  const handleMouseUp = useCallback(() => {
    if (dragging) setDragging(false);
  }, [dragging]);

  useEffect(() => {
    if (dragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, handleMouseMove, handleMouseUp]);

  return (
    <svg
      x={boxData.x}
      y={boxData.y}
      width="150"
      height="50"
      onMouseDown={handleMouseDown}
      style={{
        position: "absolute",
        left: boxData.x,
        top: boxData.y,
        cursor: selectedTool === Modes.SELECT ? "move" : "default",
      }}
    >
      <foreignObject
        width="150"
        height="50"
        className={`box-container ${boxData.selected ? "selected" : ""}`}
      >
        <div>
          <div className="box-header" style={{ backgroundColor: boxData.color }} />
          <div className="box-content">
            <div>{boxData.name}</div>
          </div>
        </div>
      </foreignObject>

      {boxData.selected && (
        <>
          <rect x={0} y={0} width={8} height={8} fill="blue" className="corner top-left" />
          <rect x={142} y={0} width={8} height={8} fill="blue" className="corner top-right" />
          <rect x={0} y={42} width={8} height={8} fill="blue" className="corner bottom-left" />
          <rect x={142} y={42} width={8} height={8} fill="blue" className="corner bottom-right" />
        </>
      )}

      {selectedTool === Modes.NEW_LINE &&
        hookPoints.map((point) => (
          <circle
            key={point.id}
            cx={point.x}
            cy={point.y}
            r="5"
            fill="blue"
            onClick={(e) => {
              e.stopPropagation();
              onHookClick(boxData.id, point.id);
            }}
            style={{ cursor: "crosshair" }}
          />
        ))}
    </svg>
  );
});

export default Box;
