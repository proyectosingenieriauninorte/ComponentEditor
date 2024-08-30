import React, { useState, useEffect } from "react";
import Box from "./Box";
import Line from "./Line";

export default function Canvas({ selectedTool, onSelectBox, boxes = [], lines = [], addBox: addBoxCallback, updateBoxPosition, deleteBox: deleteBoxCallback }) {
  const [selectedBoxId, setSelectedBoxId] = useState(null);

  const handleClick = (e) => {
    console.log(`Canvas clicked with tool: ${selectedTool}`);  // Debugging log
    if (selectedTool === "box") {
      const canvasRect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - canvasRect.left;  // Calculate x relative to canvas
      const y = e.clientY - canvasRect.top;   // Calculate y relative to canvas
      console.log(`Canvas clicked at: (${x}, ${y}), calling callback`);  // Debugging log
      addBoxCallback(x, y);  // Pass the x and y coordinates to addBox
    }
  };

  const handleBoxClick = (boxId) => {
    setSelectedBoxId(boxId);
    onSelectBox(boxId);
  }



  useEffect(() => {
    const handleKeyDown = (e) => {
      console.log(`Key pressed: ${e.key}`);  // Debugging
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedBoxId !== null) {
        deleteBoxCallback(selectedBoxId);
        setSelectedBoxId(null);  // Deselect the box after deletion
      }
    }
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    }
  }, [selectedBoxId, deleteBoxCallback]);





  return (
    <div className="canvas" onClick={handleClick}>
      {boxes.map((box) => (
        <Box
          key={box.id}
          boxData={box}
          onPointerDown={handleBoxClick}
          updateBoxPosition={updateBoxPosition}
          deleteBox={deleteBoxCallback}
        />
      ))}
      {lines.map((line) => (
        <Line key={line.id} data={line} />
      ))}
    </div>
  );
}
