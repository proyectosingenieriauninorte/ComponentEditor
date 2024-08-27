import { useState } from "react";

// useCanvas custom hook
export function useCanvas() {
  const [boxes, setBoxes] = useState([]);
  const [lines, setLines] = useState([]);

  // Function to add a new box
  const addBox = () => {
    if (boxes.length === 0) {
      const newBox = {
        id: boxes.length + 1,
        name: `Box ${boxes.length + 1}`,
        x: 800,
        y: 200,
      };
      setBoxes([...boxes, newBox]);
    }
  };

  // Function to update the position of a box
  const updateBoxPosition = (id, x, y) => {
    setBoxes((prev) =>
      prev.map((box) => (box.id === id ? { ...box, x, y } : box))
    );
    console.log(`updateBoxPosition -> (${x}, ${y})`); // Debug message
  };

  return {
    boxes,
    lines,
    addBox,
    updateBoxPosition,
  };
}
