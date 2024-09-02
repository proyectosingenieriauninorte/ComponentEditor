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

  const updateBoxPosition = (id, x, y, canvasWidth, canvasHeight) => {
    if (typeof x === 'number' && typeof y === 'number') {
      setBoxes((prevBoxes) =>
        prevBoxes.map((box) => {
          if (box.id === id) {
            // Ensure the box stays within the canvas boundaries
            const newX = Math.max(0, Math.min(x, canvasWidth - 150)); // Assuming box width is 150
            const newY = Math.max(0, Math.min(y, canvasHeight - 50));  // Assuming box height is 50
            return { ...box, x: newX, y: newY };
          }
          return box;
        })
      );
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
    if (startBoxId && endBoxId && startHook && endHook) {
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

  const selectBox = (id) => {
    setBoxes(prevBoxes =>
      prevBoxes.map(box =>
        box.id === id ? { ...box, selected: true } : { ...box, selected: false }
      )
    );
  };
  

  return {
    boxes,
    lines,
    addBox,
    updateBoxPosition,
    updateBox,
    deleteBox,
    addLine,
    selectBox,
  };
}
