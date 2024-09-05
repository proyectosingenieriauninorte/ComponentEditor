import React, { useState, useEffect, useRef } from "react";
import Box from "./Box";
import Line from "./Line";
import Modes from "../modes";

export default function Canvas({
  selectedTool, onSelectBox,
  boxes = [],
  lines = [],
  addBox: addBoxCallback,
  updateBoxPosition,
  deleteBox: deleteBoxCallback,
  onAddLine,
  clearSelection }) {
  const canvasRef = useRef(null); // Create a ref for the canvas

  const [selectedBoxId, setSelectedBoxId] = useState(null);
  const [lineStartBoxId, setLineStartBoxId] = useState(null);
  const [tempBox, setTempBox] = useState(null);
  const [canvasRect, setCanvasRect] = useState(null);
  const [lineStart, setLineStart] = useState(null);

  const handleMouseEnter = (e) => {
    if (selectedTool === Modes.NEW_BOX && !tempBox) {
      const rect = e.currentTarget.getBoundingClientRect();
      setCanvasRect(rect); // Store the bounding rect
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const newBox = {
        id: "temp", // Temporary ID
        x: x,
        y: y,
        name: "New Box",
        color: "#ffffff",
      };
      setTempBox(newBox);
    }
  };

  const handleMouseMove = (e) => {
    if (tempBox && canvasRect) {
      let x = e.clientX - canvasRect.left;
      let y = e.clientY - canvasRect.top;
      x = Math.max(0, Math.min(x, canvasRect.width - 150)); // Assuming box width is 150
      y = Math.max(0, Math.min(y, canvasRect.height - 50));  // Assuming box height is 50
      setTempBox({ ...tempBox, x, y });
    }
  };

  const handleCanvasClick = (e) => {
    e.preventDefault();
    console.log("Canvas clicked");  // Debugging log
    clearSelection(); // Clear the selection when the canvas is clicked
  };

  const handleBoxClick = (boxId, e) => {
    e.stopPropagation(); // Stop the event from propagating to the canvas
    if (selectedTool === Modes.SELECT) {
      console.log(`Hook Box clicked: ${boxId}`);  // Debugging log
      setSelectedBoxId(boxId);
      onSelectBox(boxId);
    }
  };

  const handleMouseUp = (e) => {
    if (tempBox && canvasRect) {
      let x = e.clientX - canvasRect.left;
      let y = e.clientY - canvasRect.top;

      // Ensure tempBox stays within canvas boundaries
      x = Math.max(0, Math.min(x, canvasRect.width - 150)); // Assuming box width is 150
      y = Math.max(0, Math.min(y, canvasRect.height - 50));  // Assuming box height is 50

      addBoxCallback(x, y); // Finalize the box position
      setTempBox(null); // Clear the temporary box after placing
    }
  };

  const handleHookClick = (boxId, hookPointId) => {
    if (selectedTool === Modes.NEW_LINE) {
      console.log(`Hook clicked: Box ${boxId}, Hook ${hookPointId}`);  // Debugging log
      if (lineStart) {
        onAddLine(lineStart.boxId, boxId, lineStart.hookPointId, hookPointId); // Pass both box IDs and hook points
        setLineStart(null);
      } else {
        setLineStart({ boxId, hookPointId });
      }
    }
  };

  useEffect(() => {
    if (tempBox) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }

    if (canvasRef.current) {
      setCanvasRect(canvasRef.current.getBoundingClientRect()); // Store the canvas dimensions
    }

    const handleKeyDown = (e) => {
      console.log(`Key pressed: ${e.key}`);  // Debugging
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedBoxId !== null) {
        deleteBoxCallback(selectedBoxId);
        setSelectedBoxId(null);  // Deselect the box after deletion
      }
      if (e.key === 'Escape') {
        clearSelection(); // Clear the selection
      }
    }
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }
  }, [selectedBoxId, deleteBoxCallback, tempBox]);

  return (
    <div
      ref={canvasRef} // Assign the ref to the canvas
      className="canvas"
      onMouseEnter={handleMouseEnter}
      onClick={handleCanvasClick}
      style={{ position: "relative", width: "100%", height: "100%" }}
    >
      {boxes.map((box) => (
        <Box
          key={box.id}
          boxData={box}
          onPointerDown={handleBoxClick}
          updateBoxPosition={updateBoxPosition}
          deleteBox={deleteBoxCallback}
          selectedTool={selectedTool}
          onHookClick={handleHookClick}
          canvasWidth={canvasRect ? canvasRect.width : 0}  // Pass the canvas width
          canvasHeight={canvasRect ? canvasRect.height : 0} // Pass the canvas height          
        />
      ))}
      {lines.map((line) => (
        <Line key={line.id} data={line} boxes={boxes} />
      ))}

      {tempBox && (
        <Box
          boxData={tempBox}
          selectedTool={selectedTool}
          updateBoxPosition={() => { }}
          onPointerDown={() => { }}
          onHookClick={() => { }}
          deleteBox={() => { }}
          canvasWidth={canvasRect ? canvasRect.width : 0}  // Pass the canvas width
          canvasHeight={canvasRect ? canvasRect.height : 0} // Pass the canvas height          
        />
      )}
    </div>
  );
}
