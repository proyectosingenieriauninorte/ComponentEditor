// useCanvas.jsx
import { useEffect, useRef, useState } from "react";
import CanvasManager from "../Components/Canvas/canvasmanager"; 

export function useCanvas() {
  const canvasManagerRef = useRef(new CanvasManager());
  const [state, setState] = useState(canvasManagerRef.current.state);

  useEffect(() => {
    const canvasManager = canvasManagerRef.current;
    const updateState = () => setState({ ...canvasManager.state });

    // Subscribe to state changes
    canvasManager.onStateChange = updateState;

    return () => {
      canvasManager.cleanup();
    };
  }, []);

  return {
    ...state,
    addBox: canvasManagerRef.current.addBox.bind(canvasManagerRef.current),
    updateBoxPosition: canvasManagerRef.current.updateBoxPosition.bind(canvasManagerRef.current),
    updateBox: canvasManagerRef.current.updateBox.bind(canvasManagerRef.current),
    deleteBox: canvasManagerRef.current.deleteBox.bind(canvasManagerRef.current),
    addLine: canvasManagerRef.current.addLine.bind(canvasManagerRef.current),
    selectBox: canvasManagerRef.current.selectBox.bind(canvasManagerRef.current),
  };
}
