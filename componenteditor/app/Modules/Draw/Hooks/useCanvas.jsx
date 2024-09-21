import { useState, useEffect } from "react";
import CanvasManager from "../Components/Canvas/canvasmanager.js";

export function useCanvas() {
  const [canvasManager] = useState(new CanvasManager());
  const [state, setState] = useState(canvasManager.state);

  useEffect(() => {
    setState(canvasManager.state);
  }, [canvasManager]);

  const addBox = (x, y, width = 150, height = 50, color = '#f00') => {
    canvasManager.addBox(x, y, width, height, color);
    setState({ ...canvasManager.state });
  };

  const updateBoxPosition = (id, x, y, canvasWidth, canvasHeight) => {
    canvasManager.updateBoxPosition(id, x, y, canvasWidth, canvasHeight);
    setState({ ...canvasManager.state });
  };

  const updateBox = (id, updatedProperties) => {
    canvasManager.updateBox(id, updatedProperties);
    setState({ ...canvasManager.state });
  };

  const deleteBox = (id) => {
    canvasManager.deleteBox(id);
    setState({ ...canvasManager.state });
  };

  const addLine = (startBoxId, endBoxId, startHook, endHook) => {
    canvasManager.addLine(startBoxId, endBoxId, startHook, endHook);
    setState({ ...canvasManager.state });
  };

  const selectBox = (id) => {
    canvasManager.selectBox(id);
    setState({ ...canvasManager.state });
  };

  return {
    boxes: state.boxes,
    lines: state.lines,
    addBox,
    updateBoxPosition,
    updateBox,
    deleteBox,
    addLine,
    selectBox,
  };
}