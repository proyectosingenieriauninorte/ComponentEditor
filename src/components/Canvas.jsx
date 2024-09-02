import React, { useState, useEffect } from "react";
import Box from "./Box";
import Line from "./Line";
import Modes from "../modes";

export default function Canvas({ 
  selectedTool, onSelectBox, 
  boxes = [],
  lines = [], 
  addBox: addBoxCallback, 
  updateBoxPosition, 
  deleteBox: deleteBoxCallback, 
  addLine }) {

  const [selectedBoxId, setSelectedBoxId] = useState(null);
  const [lineStartBoxId, setLineStartBoxId] = useState(null);
  const [tempBox, setTempBox] = useState(null);
  const [canvasRect, setCanvasRect] = useState(null);

  const handleMouseEnter = (e) => {
    if (selectedTool === Modes.NEW_BOX && !tempBox) {
      const canvasRect = e.currentTarget.getBoundingClientRect();
      const rect = e.currentTarget.getBoundingClientRect();
      setCanvasRect(rect); // Store the bounding rect
      const x = e.clientX - canvasRect.left;
      const y = e.clientY - canvasRect.top;
      const newBox = {
        id: "temp", // Temporary ID
        x: x,
        y: y,
        name: "New Box",
        color: "#ffffff",
      };
      setTempBox(newBox);
    }
  };

  const handleMouseMove = (e) => {
    if (tempBox && canvasRect) {
      const x = e.clientX - canvasRect.left;
      const y = e.clientY - canvasRect.top;
      setTempBox({ ...tempBox, x, y });
    }
  };

    const handleBoxClick = (boxId) => {
      if (selectedTool === Modes.SELECT) {
        console.log(`Hook Box clicked: ${boxId}`);  // Debugging log
        onSelectBox(boxId);
      }
    };


    const handleMouseUp = (e) => {
      if (tempBox && canvasRect) {
        const x = e.clientX - canvasRect.left;
        const y = e.clientY - canvasRect.top;
        addBoxCallback(x, y); // Finalize the box position
        setTempBox(null); // Clear the temporary box after placing
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

    if (tempBox ) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }

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
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }
  }, [selectedBoxId, deleteBoxCallback, tempBox]);





  return (
    <div
     className="canvas"
     onMouseEnter={handleMouseEnter}
     style={{ position: "relative", width: "100%", height: "100%" }}
     >
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

        {tempBox && (
        <Box
          boxData={tempBox}
          selectedTool={selectedTool}
          updateBoxPosition={() => {}}
          onPointerDown={() => {}}
          onHookClick={() => {}}
          deleteBox={() => {}}
        />
      )}
    </div>
  );
}
