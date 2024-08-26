import { useState } from "react";

export function useCanvas() {
  const [boxes, setBoxes] = useState([]);
  const [lines, setLines] = useState([]);

  const addBox = () => {
    if (boxes.length === 0) {
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
    updateBoxPosition,  // Ensure this function is returned
  };
}
