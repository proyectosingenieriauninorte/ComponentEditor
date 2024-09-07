import React, { useState, useEffect, useRef, useCallback } from "react";
import Box from "../Box";
import Line from "../Line";
import Modes from "@/app/Modules/Toolbar/Modes";
import "./canvas.css";
export default function Canvas({
  selectedTool, onSelectBox,
  boxes = [],
  lines = [],
  addBox: addBoxCallback,
  updateBoxPosition,
  deleteBox: deleteBoxCallback,
  onAddLine,
  clearSelection 
}) {
  const canvasRef = useRef(null);
  const [selectedBoxId, setSelectedBoxId] = useState(null);
  const [lineStartBoxId, setLineStartBoxId] = useState(null);
  const [tempBox, setTempBox] = useState(null);
  const [canvasRect, setCanvasRect] = useState(null);
  const [lineStart, setLineStart] = useState(null);

  const handleMouseEnter = useCallback((e) => {
    if (selectedTool === Modes.NEW_BOX && !tempBox) {
      const rect = e.currentTarget.getBoundingClientRect();
      setCanvasRect(rect);
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setTempBox({
        id: "temp",
        x,
        y,
        name: "New Box",
        color: "#ffffff",
      });
    }
  }, [selectedTool, tempBox]);

  const handleMouseMove = useCallback((e) => {
    if (tempBox && canvasRect) {
      let x = e.clientX - canvasRect.left;
      let y = e.clientY - canvasRect.top;
      x = Math.max(0, Math.min(x, canvasRect.width - 150));
      y = Math.max(0, Math.min(y, canvasRect.height - 50));
      setTempBox((prev) => ({ ...prev, x, y }));
    }
  }, [tempBox, canvasRect]);

  const handleCanvasClick = useCallback((e) => {
    e.preventDefault();
    clearSelection();
  }, [clearSelection]);

  const handleBoxClick = useCallback((boxId, e) => {
    e.stopPropagation();
    if (selectedTool === Modes.SELECT) {
      setSelectedBoxId(boxId);
      onSelectBox(boxId);
    }
  }, [selectedTool, onSelectBox]);

  const handleMouseUp = useCallback((e) => {
    if (tempBox && canvasRect) {
      let x = e.clientX - canvasRect.left;
      let y = e.clientY - canvasRect.top;
      x = Math.max(0, Math.min(x, canvasRect.width - 150));
      y = Math.max(0, Math.min(y, canvasRect.height - 50));
      addBoxCallback(x, y);
      setTempBox(null);
    }
  }, [tempBox, canvasRect, addBoxCallback]);

  const handleHookClick = useCallback((boxId, hookPointId) => {
    if (selectedTool === Modes.NEW_LINE) {
      if (lineStart) {
        onAddLine(lineStart.boxId, boxId, lineStart.hookPointId, hookPointId);
        setLineStart(null);
      } else {
        setLineStart({ boxId, hookPointId });
      }
    }
  }, [selectedTool, lineStart, onAddLine]);

  useEffect(() => {
    if (tempBox) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }

    if (canvasRef.current) {
      setCanvasRect(canvasRef.current.getBoundingClientRect());
    }

    const handleKeyDown = (e) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedBoxId !== null) {
        deleteBoxCallback(selectedBoxId);
        setSelectedBoxId(null);
      }
      if (e.key === 'Escape') {
        clearSelection();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [selectedBoxId, deleteBoxCallback, tempBox, handleMouseMove, handleMouseUp, clearSelection]);

  return (
    <div
      ref={canvasRef}
      className="canvas"
      onMouseEnter={handleMouseEnter}
      onClick={handleCanvasClick}
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
          canvasWidth={canvasRect ? canvasRect.width : 0}
          canvasHeight={canvasRect ? canvasRect.height : 0}
        />
      ))}
      {lines.map((line) => (
        <Line key={line.id} data={line} boxes={boxes} />
      ))}

      {tempBox && (
        <Box
          boxData={tempBox}
          selectedTool={selectedTool}
          updateBoxPosition={() => {}}
          onPointerDown={() => {}}
          onHookClick={() => {}}
          deleteBox={() => {}}
          canvasWidth={canvasRect ? canvasRect.width : 0}
          canvasHeight={canvasRect ? canvasRect.height : 0}
        />
      )}
    </div>
  );
}
