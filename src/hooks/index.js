import { useState } from "react";

export function useCanvas() {
  const [boxes, setBoxes] = useState([]);
  const [lines, setLines] = useState([]);

  const gridSize = 20; // Set the grid size for snapping

  const snapToGrid = (value) => {
    return Math.round(value / gridSize) * gridSize;
  };

  const isPositionValid = (x, y, width, height) => {
    return !boxes.some(box => 
      x < box.x + box.width &&
      x + width > box.x &&
      y < box.y + box.height &&
      y + height > box.y
    );
  };

  const findNearestValidPosition = (x, y, width, height) => {
    const maxIterations = 50; // Limit the number of iterations to prevent infinite loops
    const offsets = [
      { dx: 0, dy: 0 }, // Try the original position first
      { dx: gridSize, dy: 0 },
      { dx: -gridSize, dy: 0 },
      { dx: 0, dy: gridSize },
      { dx: 0, dy: -gridSize },
      { dx: gridSize, dy: gridSize },
      { dx: -gridSize, dy: gridSize },
      { dx: gridSize, dy: -gridSize },
      { dx: -gridSize, dy: -gridSize },
    ];

    for (let i = 0; i < maxIterations; i++) {
      for (const offset of offsets) {
        const newX = x + offset.dx * i;
        const newY = y + offset.dy * i;

        if (isPositionValid(newX, newY, width, height)) {
          return { x: newX, y: newY };
        }
      }
    }

    return { x, y }; // Return the original position if no valid position is found
  };

  const addBox = (x, y) => {
    const snappedX = snapToGrid(x);
    const snappedY = snapToGrid(y);
    const boxWidth = 150;  // Assuming the box width is 150px
    const boxHeight = 50;  // Assuming the box height is 50px

    let finalPosition = { x: snappedX, y: snappedY };

    if (!isPositionValid(snappedX, snappedY, boxWidth, boxHeight)) {
      finalPosition = findNearestValidPosition(snappedX, snappedY, boxWidth, boxHeight);
      console.log(`Invalid position, box moved to nearest valid position at (${finalPosition.x}, ${finalPosition.y}).`);
    }

    const newBox = {
      id: boxes.length + 1,
      name: `Box ${boxes.length + 1}`,
      x: finalPosition.x,
      y: finalPosition.y,
      width: boxWidth,
      height: boxHeight,
      color: '#f00',
      selected: false,
    };
    setBoxes([...boxes, newBox]);
    console.log(`Hook Added Box ID: ${newBox.id}, Position: (${newBox.x}, ${newBox.y})`);
  };

  const updateBoxPosition = (id, x, y, canvasWidth, canvasHeight) => {
    if (typeof x === 'number' && typeof y === 'number') {
      const snappedX = snapToGrid(x);
      const snappedY = snapToGrid(y);

      setBoxes((prevBoxes) =>
        prevBoxes.map((box) => {
          if (box.id === id) {
            // Ensure the box stays within the canvas boundaries
            const newX = Math.max(0, Math.min(snappedX, canvasWidth - box.width)); 
            const newY = Math.max(0, Math.min(snappedY, canvasHeight - box.height));  

            // Check if the new position is valid
            if (!isPositionValid(newX, newY, box.width, box.height)) {
              const validPosition = findNearestValidPosition(newX, newY, box.width, box.height);
              return { ...box, x: validPosition.x, y: validPosition.y };
            } else {
              return { ...box, x: newX, y: newY };
            }
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
