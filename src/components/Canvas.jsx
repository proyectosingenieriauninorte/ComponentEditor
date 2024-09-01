import React, { useState, useEffect } from "react";
import Box from "./Box";
import Line from "./Line";
import Modes from "../modes";

export default function Canvas({ selectedTool, onSelectBox, boxes = [], lines = [], addBox: addBoxCallback, updateBoxPosition, deleteBox: deleteBoxCallback, addLine }) {
  const [selectedBoxId, setSelectedBoxId] = useState(null);
  const [lineStartBoxId, setLineStartBoxId] = useState(null);

  const handleClick = (e) => {
    //console.log(`Canvas clicked with tool: ${selectedTool}`);  // Debugging log
    if (selectedTool === Modes.NEW_BOX) {
      const canvasRect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - canvasRect.left;  // Calculate x relative to canvas
      const y = e.clientY - canvasRect.top;   // Calculate y relative to canvas
      //console.log(`Canvas clicked at: (${x}, ${y}), calling callback`);  // Debugging log
      addBoxCallback(x, y);  // Pass the x and y coordinates to addBox
    }
  };

/*   const handleBoxClick = (boxId) => {
    setSelectedBoxId(boxId);
    if (selectedTool === Modes.SELECT) {
      onSelectBox(boxId);
    } else if (selectedTool === Modes.NEW_LINE) {
      if (lineStartBoxId === null) {
        setLineStartBoxId(boxId);
      } else {
        console.log(`Creating line between boxes: ${lineStartBoxId} and ${boxId}`);  // Debugging log
        setLineStartBoxId(null);
        addLine(lineStartBoxId, boxId);
      }
    }  
  } */

    const handleBoxClick = (boxId) => {
      if (selectedTool === Modes.SELECT) {
        console.log(`Hook Box clicked: ${boxId}`);  // Debugging log
        onSelectBox(boxId);
      }
    };
    
  const handleHookClick = (boxId, hookPointId) => {
    if (selectedTool === Modes.NEW_LINE) {
      console.log(`Hook clicked: Box ${boxId}, Hook ${hookPointId}`);  // Debugging log
      if (lineStart) {
        onAddLine(lineStart.boxId, lineStart.hookPointId, boxId, hookPointId);
        setLineStart(null);
      } else {
        setLineStart({ boxId, hookPointId });
      }
    }
  };



  useEffect(() => {
    const handleKeyDown = (e) => {
      console.log(`Key pressed: ${e.key}`);  // Debugging
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedBoxId !== null) {
        deleteBoxCallback(selectedBoxId);
        setSelectedBoxId(null);  // Deselect the box after deletion
      }
    }
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    }
  }, [selectedBoxId, deleteBoxCallback]);





  return (
    <div className="canvas" onClick={handleClick}>
      {boxes.map((box) => (
        <Box
          key={box.id}
          boxData={box}
          onPointerDown={handleBoxClick}
          updateBoxPosition={updateBoxPosition}
          deleteBox={deleteBoxCallback}
          selectedTool={selectedTool}
          onHookClick={handleHookClick}

        />
      ))}
      {lines.map((line) => (
        <Line key={line.id} data={line} boxes={boxes}/>
      ))}
    </div>
  );
}
