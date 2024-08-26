import { useState } from "react";

export function useCanvas() {
  const [boxes, setBoxes] = useState([]); // Start with an empty array
  const [lines, setLines] = useState([]);

  const addBox = () => {
    if (boxes.length === 0) { // Check if there are no boxes
      const newBox = {
        id: boxes.length + 1,
        name: `Box ${boxes.length + 1}`,
        x: 400,
        y: 200,
      };
      setBoxes([...boxes, newBox]);
    }
  };

  const updateBoxPosition = (id, x, y) => {
    setBoxes((prev) =>
      prev.map((box) => (box.id === id ? { ...box, x, y } : box))
    );
  };

  return {
    boxes,
    lines,
    addBox,
    updateBoxPosition,
  };
}
