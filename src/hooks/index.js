import { useState } from "react";

export function useCanvas() {
  const [boxes, setBoxes] = useState([]);  // Initialized as an empty array
  const [lines, setLines] = useState([]);  // Initialized as an empty array

  const addBox = () => {
    const newBox = {
      id: boxes.length + 1,
      name: `Box ${boxes.length + 1}`,
      x: 100, // Initial x position
      y: 100, // Initial y position
      color: '#f00', // Example color
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
    lines,  // Ensure this is returned properly
    addBox,
    updateBoxPosition,
    deleteBox,
  };
}
