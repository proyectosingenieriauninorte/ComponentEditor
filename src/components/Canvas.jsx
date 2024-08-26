import React from "react";
import Box from "./Box";
import Line from "./Line";

export default function Canvas({ selectedTool, onSelectBox, boxes, lines, addBox, updateBoxPosition }) {
  const handleClick = () => {
    if (selectedTool === "box") {
      addBox();
    }
  };

  return (
    <div className="canvas" onClick={handleClick}>
      {boxes.map((box) => (
        <Box
          key={box.id}
          data={box}
          onPointerDown={() => onSelectBox(box.id)}
          updateBoxPosition={updateBoxPosition}  // Ensure this is passed correctly
        />
      ))}
      {lines.map((line) => (
        <Line key={line.id} data={line} />
      ))}
    </div>
  );
}
