import { useState } from "react";

export function useCanvas() {
  const [boxes, setBoxes] = useState([]);  // Array to store multiple boxes
  const [lines, setLines] = useState([]);  // Array to store lines (if needed)

  const addBox = () => {
    const newBox = {
      id: boxes.length + 1,
      name: `Box ${boxes.length + 1}`,
      x: 100 + boxes.length * 10,  // Offset new boxes slightly for visibility
      y: 100 + boxes.length * 10,  // Offset new boxes slightly for visibility
      color: '#f00',  // Example color
      selected: false,
    };
    setBoxes([...boxes, newBox]);
    console.log(`Added Box ID: ${newBox.id}, Initial Position: (${newBox.x}, ${newBox.y})`);
  };

  const updateBoxPosition = (id, x, y) => {
    setBoxes((prevBoxes) =>
      prevBoxes.map((box) =>
        box.id === id ? { ...box, x: x, y: y } : box
      )
    );
    console.log(`Updated Box Position: ID ${id}, New Position: (${x}, ${y})`);
  };

  const deleteBox = (id) => {
    setBoxes((prevBoxes) => prevBoxes.filter((box) => box.id !== id));
    console.log(`Deleted Box ID: ${id}`);
  };

  return {
    boxes,
    lines,
    addBox,
    updateBoxPosition,
    deleteBox,
  };
}
