import React, { useMemo } from "react";
import useCanvas from "../../Hooks/useCanvas";

const Line = ({ data, boxes }) => {
  const { getHookOffsets } = useCanvas();

  const startBox = useMemo(() => boxes.find((box) => box.id === data.startBoxId), [boxes, data.startBoxId]);
  const endBox = useMemo(() => boxes.find((box) => box.id === data.endBoxId), [boxes, data.endBoxId]);

  if (!startBox || !endBox) {
    console.error("Start or End Box not found", { startBox, endBox });
    return null;
  }

  const startOffset = getHookOffsets(startBox, data.startHook);
  const endOffset = getHookOffsets(endBox, data.endHook);

  const startX = startOffset.x + startBox.x;
  const startY = startOffset.y + startBox.y;
  const endX = endOffset.x + endBox.x;
  const endY = endOffset.y + endBox.y;

  const pathD = `
    M ${startX},${startY} 
    L ${endX},${endY}
  `;

  return (
    <svg
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    >
      <g>
        <path d={pathD} stroke="gray" strokeWidth="2" fill="none" />
      </g>
    </svg>
  );
};

export default React.memo(Line);