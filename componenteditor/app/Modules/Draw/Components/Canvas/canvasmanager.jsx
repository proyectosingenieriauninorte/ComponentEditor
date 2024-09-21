import React, { useState, useEffect, createContext } from "react";
import Modes from "@/app/Modules/Toolbar/Modes";

const CanvasManagerContext = createContext();

const CanvasManager = ({ children }) => {
  const [state, setState] = useState({
    selectedBoxId: null,
    lineStartBoxId: null,
    tempBox: null,
    canvasRect: null,
    lineStart: null,
    boxes: [],
    lines: [],
  });

  const gridSize = 20;

  const setCanvasRect = (rect) => {
    setState((prevState) => ({ ...prevState, canvasRect: rect }));
  };

  const snapToGrid = (value) => Math.round(value / gridSize) * gridSize;

  const isPositionValid = (x, y, width, height) => {
    return !state.boxes.some(
      (box) =>
        x < box.x + box.width &&
        x + width > box.x &&
        y < box.y + box.height &&
        y + height > box.y
    );
  };

  const findNearestValidPosition = (x, y, width, height) => {
    const offsets = [
      { dx: 0, dy: 0 },
      { dx: gridSize, dy: 0 },
      { dx: -gridSize, dy: 0 },
      { dx: 0, dy: gridSize },
      { dx: 0, dy: -gridSize },
      { dx: gridSize, dy: gridSize },
      { dx: -gridSize, dy: gridSize },
      { dx: gridSize, dy: -gridSize },
      { dx: -gridSize, dy: -gridSize },
    ];

    for (let i = 0; i < 50; i++) {
      for (const offset of offsets) {
        const newX = x + offset.dx * i;
        const newY = y + offset.dy * i;
        if (isPositionValid(newX, newY, width, height)) {
          return { x: newX, y: newY };
        }
      }
    }
    return { x, y };
  };

  const addBox = (x, y, width = 150, height = 50, color = '#f00') => {
    const snappedX = snapToGrid(x);
    const snappedY = snapToGrid(y);

    let finalPosition = { x: snappedX, y: snappedY };
    if (!isPositionValid(snappedX, snappedY, width, height)) {
      finalPosition = findNearestValidPosition(snappedX, snappedY, width, height);
      console.log(`Box moved to nearest valid position at (${finalPosition.x}, ${finalPosition.y}).`);
    }

    const newBox = {
      id: state.boxes.length + 1,
      name: `Box ${state.boxes.length + 1}`,
      x: finalPosition.x,
      y: finalPosition.y,
      width,
      height,
      color,
      selected: false,
    };

    setState((prevState) => ({
      ...prevState,
      boxes: [...prevState.boxes, newBox],
    }));
    console.log(`Added Box ID: ${newBox.id}, Position: (${newBox.x}, ${newBox.y})`);
  };

  const updateBoxPosition = (id, x, y, canvasWidth, canvasHeight) => {
    const snappedX = snapToGrid(x);
    const snappedY = snapToGrid(y);

    setState((prevState) => ({
      ...prevState,
      boxes: prevState.boxes.map((box) =>
        box.id === id
          ? {
              ...box,
              x: Math.max(0, Math.min(snappedX, canvasWidth - box.width)),
              y: Math.max(0, Math.min(snappedY, canvasHeight - box.height)),
            }
          : box
      ),
    }));
  };

  const updateBox = (id, updatedProperties) => {
    setState((prevState) => ({
      ...prevState,
      boxes: prevState.boxes.map((box) =>
        box.id === id ? { ...box, ...updatedProperties } : box
      ),
    }));
  };

  const deleteBox = (id) => {
    console.log(`Deleting Box with ID: ${id}`);
    setState((prevState) => ({
      ...prevState,
      boxes: prevState.boxes.filter((box) => box.id !== id),
    }));
  };

  const addLine = (startBoxId, endBoxId, startHook, endHook) => {
    if (!startBoxId || !endBoxId || !startHook || !endHook) {
      console.error("Invalid parameters for adding a line", { startBoxId, endBoxId, startHook, endHook });
      return;
    }

    const newLine = {
      id: state.lines.length + 1,
      startBoxId,
      endBoxId,
      startHook,
      endHook,
    };

    setState((prevState) => ({
      ...prevState,
      lines: [...prevState.lines, newLine],
    }));
    console.log(`Added Line ID: ${newLine.id} between boxes ${startBoxId} and ${endBoxId}`);
  };

  const selectBox = (id) => {
    setState((prevState) => ({
      ...prevState,
      boxes: prevState.boxes.map((box) => ({ ...box, selected: box.id === id })),
    }));
  };

  const handleMouseEnter = (e, selectedTool) => {
    const { tempBox } = state;
    if (selectedTool === Modes.NEW_BOX && !tempBox) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setState((prevState) => ({
        ...prevState,
        canvasRect: rect,
        tempBox: {
          id: "temp",
          x,
          y,
          width: 150,
          height: 50,
          name: "Newest! Box",
          color: "#ffffff",
        },
      }));
    }
  };

  const handleMouseMove = (e) => {
    const { tempBox, canvasRect } = state;
    if (tempBox && canvasRect) {
      let x = e.clientX - canvasRect.left;
      let y = e.clientY - canvasRect.top;
      x = Math.max(0, Math.min(x, canvasRect.width - 150));
      y = Math.max(0, Math.min(y, canvasRect.height - 50));
      setState((prevState) => ({
        ...prevState,
        tempBox: { ...tempBox, x, y },
      }));
    }
  };

  const handleMouseUp = (e, addBoxCallback) => {
    const { tempBox, canvasRect } = state;
    if (tempBox && canvasRect) {
      let x = e.clientX - canvasRect.left;
      let y = e.clientY - canvasRect.top;
      x = Math.max(0, Math.min(x, canvasRect.width - 150));
      y = Math.max(0, Math.min(y, canvasRect.height - 50));
      addBoxCallback(x, y);
      setState((prevState) => ({ ...prevState, tempBox: null }));
    }
  };

  const handleBoxClick = (boxId, selectedTool, onSelectBox) => {
    if (selectedTool === Modes.SELECT) {
      setState((prevState) => ({
        ...prevState,
        selectedBoxId: boxId,
      }));
      onSelectBox(boxId);
    }
  };

  const handleHookClick = (boxId, hookPointId, selectedTool, onAddLine) => {
    const { lineStart } = state;
    if (selectedTool === Modes.NEW_LINE) {
      if (lineStart) {
        onAddLine(lineStart.boxId, boxId, lineStart.hookPointId, hookPointId);
        setState((prevState) => ({ ...prevState, lineStart: null }));
      } else {
        setState((prevState) => ({
          ...prevState,
          lineStart: { boxId, hookPointId },
        }));
      }
    }
  };

  const handleKeyDown = (e, deleteBoxCallback, clearSelection) => {
    const { selectedBoxId } = state;
    if (e.key === "Delete" && selectedBoxId !== null) {
      deleteBoxCallback(selectedBoxId);
      setState((prevState) => ({ ...prevState, selectedBoxId: null }));
    }
    if (e.key === "Escape") {
      clearSelection();
    }
  };

  return (
    <CanvasManagerContext.Provider
      value={{
        state,
        setCanvasRect,
        addBox,
        updateBoxPosition,
        updateBox,
        deleteBox,
        addLine,
        selectBox,
        handleMouseEnter,
        handleMouseMove,
        handleMouseUp,
        handleBoxClick,
        handleHookClick,
        handleKeyDown,
      }}
    >
      {children}
    </CanvasManagerContext.Provider>
  );
};

export { CanvasManagerContext };

export default CanvasManager;