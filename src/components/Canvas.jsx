import React from "react";
import Box from "./Box";
import Line from "./Line";

export default function Canvas({ selectedTool, onSelectBox, boxes = [], lines = [], addBox, updateBoxPosition, deleteBox }) {
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
