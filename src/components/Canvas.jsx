import React from "react";
import Box from "./Box";
import Line from "./Line";

export default function Canvas({ selectedTool, onSelectBox, boxes = [], lines = [], addBox: addBoxCallback, updateBoxPosition, deleteBox }) {
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

  return (
    <div className="canvas" onClick={handleClick}>
      {boxes.map((box) => (
        <Box
          key={box.id}
          boxData={box}
          onPointerDown={onSelectBox}
          updateBoxPosition={updateBoxPosition}
          deleteBox={deleteBox}
        />
      ))}
      {lines.map((line) => (
        <Line key={line.id} data={line} />
      ))}
    </div>
  );
}
