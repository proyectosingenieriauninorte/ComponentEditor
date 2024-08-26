import { useState } from "react";

export function useCanvas() {
  const [boxes, setBoxes] = useState([
    { id: 1, name: "Box 1", x: 100, y: 100 },
    { id: 2, name: "Box 2", x: 300, y: 300 },
  ]);

  const [lines, setLines] = useState([]);

  const addLine = (line) => setLines((prev) => [...prev, line]);

  const updateBox = (id, updates) => {
    setBoxes((prev) =>
      prev.map((box) => (box.id === id ? { ...box, ...updates } : box))
    );
  };

  return {
    boxes,
    lines,
    addLine,
    updateBox,
  };
}

// Placeholder hooks
export function useSettings() {
  return {
    settings: {
      showGrid: true,
    },
  };
}

export function useTransform() {
  const [transform, setTransform] = useState({ pan: { x: 0, y: 0 }, zoom: 1 });
  return {
    transform,
    setTransform,
  };
}

export function useUndoRedo() {
  return {
    setUndoStack: () => {},
    setRedoStack: () => {},
  };
}

export function useSelect() {
  const [selectedElement, setSelectedElement] = useState({ element: "NONE", id: -1 });
  return {
    selectedElement,
    setSelectedElement,
  };
}

export function useLayout() {
  return {
    layout: {},
  };
}
