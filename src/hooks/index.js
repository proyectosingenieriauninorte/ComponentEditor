import { useState } from "react";

export function useCanvas() {
  const [boxes, setBoxes] = useState([]);
  const [lines, setLines] = useState([]);

  const addBox = (x, y) => {
    //console.log(`Hook Adding Box at: (${x}, ${y})`);  // Debugging log
    const newBox = {
      id: boxes.length + 1,
      name: `Box ${boxes.length + 1}`,
      x: x || 100,  // Ensure that x is set, with a fallback to 100
      y: y || 100,  // Ensure that y is set, with a fallback to 100
      color: '#f00',
      selected: false,
    };
    setBoxes([...boxes, newBox]);
    console.log(`Hook Added Box ID: ${newBox.id}, Position: (${newBox.x}, ${newBox.y})`);
  };

  const updateBoxPosition = (id, x, y) => {
    if (typeof x === 'number' && typeof y === 'number') {
      setBoxes((prevBoxes) =>
        prevBoxes.map((box) =>
          box.id === id ? { ...box, x: x, y: y } : box
        )
      );
      //console.log(`Updated Box Position: ID ${id}, New Position: (${x}, ${y})`);
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
    console.log(`Hook Deleting Box with ID: ${id}`);  // Debug
    setBoxes((prevBoxes) => prevBoxes.filter((box) => box.id !== id));
  };

  const addLine = ({ startBoxId, endBoxId, startHook, endHook }) => {
    console.log(`Hook Adding Line between boxes: ${startBoxId} and ${endBoxId} from ${startHook} to ${endHook}`);  // Debug
  
    // Ensure that all required parameters are provided and valid
    if (startBoxId && endBoxId && startHook && endHook && startBoxId !== endBoxId) {
      const newLine = {
        id: lines.length + 1,
        startBoxId,
        endBoxId,
        startHook,
        endHook,
      };
      setLines([...lines, newLine]);
      console.log(`Line Added: ${newLine.id} between boxes: ${startBoxId} and ${endBoxId} from ${startHook} to ${endHook}`);
    } else {
      console.error("Invalid parameters for adding a line", { startBoxId, endBoxId, startHook, endHook });
    }
  };

  return {
    boxes,
    lines,
    addBox,
    updateBoxPosition,
    updateBox,
    deleteBox,
    addLine,
  };
}
