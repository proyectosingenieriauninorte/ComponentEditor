import { useRef, useState } from "react";
import { Toast } from "@douyinfe/semi-ui";
import Box from "./Box";
import Line from "./Line";
import {
  useCanvas,
  useSettings,
  useTransform,
  useUndoRedo,
  useSelect,
  useLayout,
} from "../hooks";

export default function Canvas() {
  const canvasRef = useRef(null);
  const { boxes, lines, addLine, updateBox } = useCanvas();
  const { settings } = useSettings();
  const { transform, setTransform } = useTransform();
  const { setUndoStack, setRedoStack } = useUndoRedo();
  const { selectedElement, setSelectedElement } = useSelect();
  const [dragging, setDragging] = useState({ element: "NONE", id: -1 });
  const [linking, setLinking] = useState(false);
  const [linkingLine, setLinkingLine] = useState({
    startBoxId: -1,
    endBoxId: -1,
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
  });

  const handlePointerDownOnElement = (e, id) => {
    if (!e.isPrimary) return;

    const box = boxes.find((b) => b.id === id);
    setDragging({
      element: "BOX",
      id: id,
    });
    setSelectedElement({ element: "BOX", id });
  };

  const handlePointerMove = (e) => {
    if (!e.isPrimary) return;

    if (linking) {
      setLinkingLine((prev) => ({
        ...prev,
        endX: e.clientX,
        endY: e.clientY,
      }));
    } else if (dragging.element === "BOX" && dragging.id >= 0) {
      updateBox(dragging.id, {
        x: e.clientX,
        y: e.clientY,
      });
    }
  };

  const handlePointerUp = () => {
    if (linking) handleLinking();
    setLinking(false);
    setDragging({ element: "NONE", id: -1 });
  };

  const handleGripField = () => {
    setDragging({ element: "NONE", id: -1 });
    setLinking(true);
  };

  const handleLinking = () => {
    if (linkingLine.endBoxId < 0) return;

    if (linkingLine.startBoxId === linkingLine.endBoxId) {
      Toast.info("Cannot link a box to itself");
      return;
    }

    const newLine = {
      ...linkingLine,
      id: lines.length,
    };
    addLine(newLine);
  };

  return (
    <div
      className="w-full h-full relative"
      ref={canvasRef}
      onPointerMove={handlePointerMove}
      onPointerDown={() => setDragging({ element: "NONE", id: -1 })}
      onPointerUp={handlePointerUp}
    >
      {boxes.map((box) => (
        <Box
          key={box.id}
          data={box}
          onPointerDown={(e) => handlePointerDownOnElement(e, box.id)}
          handleGripField={handleGripField}
          setLinkingLine={setLinkingLine}
        />
      ))}
      {lines.map((line) => (
        <Line key={line.id} data={line} />
      ))}
      {linking && (
        <path
          d={`M ${linkingLine.startX} ${linkingLine.startY} L ${linkingLine.endX} ${linkingLine.endY}`}
          stroke="black"
          strokeDasharray="5,5"
        />
      )}
    </div>
  );
}
