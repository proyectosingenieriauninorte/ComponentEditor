import React from "react";
import Box from "./Box";
import Line from "./Line";

export default function Canvas({ selectedTool, onSelectBox, boxes = [], lines = [], addBox, updateBoxPosition, deleteBox }) {  // Default to empty arrays
  const handleClick = () => {
    if (selectedTool === "box" && boxes.length === 0) { // Ensures only one box can be added
      addBox();
    }
  };

  return (
    <div className="canvas" onClick={handleClick} style={{ position: 'relative', width: '100%', height: '100%' }}>
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
