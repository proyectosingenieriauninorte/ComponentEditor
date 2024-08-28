import { useState } from "react";

export function useCanvas() {
  const [boxes, setBoxes] = useState([]);

  const addBox = () => {
    const newBox = {
      id: boxes.length + 1,
      name: `Box ${boxes.length + 1}`,
      x: 100 + boxes.length * 10,
      y: 100 + boxes.length * 10,
      color: '#f00',
      selected: false,
    };
    setBoxes([...boxes, newBox]);
  };

  const updateBoxPosition = (id, x, y) => {
    if (typeof x === 'number' && typeof y === 'number') {
      setBoxes((prevBoxes) =>
        prevBoxes.map((box) =>
          box.id === id ? { ...box, x: x, y: y } : box
        )
      );
      console.log(`Updated Box Position: ID ${id}, New Position: (${x}, ${y})`);
    } else {
      console.error('Invalid position values:', x, y);
    }
  };

  const updateBox = (id, updatedProperties) => {
    setBoxes((prevBoxes) =>
      prevBoxes.map((box) =>
        box.id === id ? { ...box, ...updatedProperties } : box
      )
    );
  };

  const deleteBox = (id) => {
    setBoxes((prevBoxes) => prevBoxes.filter((box) => box.id !== id));
  };

  return {
    boxes,
    addBox,
    updateBoxPosition,
    updateBox,
    deleteBox,
  };
}
