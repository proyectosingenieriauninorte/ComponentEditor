import React from "react";
import Box from "./Box";
import Line from "./Line";


export default function Canvas({ selectedTool, onSelectBox, boxes, lines, addBox, updateBoxPosition }) {
  const handleClick = () => {
    if (selectedTool === "box" && boxes.length === 0) { // Ensures only one box can be added
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
          updateBoxPosition={updateBoxPosition}  // Passed correctly
        />
      ))}
      {lines.map((line) => (
        <Line key={line.id} data={line} />
      ))}
    </div>
  );
}

