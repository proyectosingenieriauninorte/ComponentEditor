import React, { useState, useRef, useEffect } from "react";
import {
  IconEdit,
  IconMinus,
  IconDeleteStroked,
} from "@douyinfe/semi-icons";
import { Popover, Button } from "@douyinfe/semi-ui";

export default function Box(props) {
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const {
    boxData,
    onPointerDown,
    updateBoxPosition,
    deleteBox,
  } = props;

  const buttonRef = useRef(); // Create a ref for the button

  const height = 50; // Static height for a box
  const width = 150; // Static width for a box

  const handleMouseDown = (e) => {
    e.preventDefault();
    setDragging(true);
    setOffset({
      x: e.clientX - boxData.x,
      y: e.clientY - boxData.y,
    });
    if (onPointerDown) onPointerDown(boxData.id); // Notify parent that this box is selected
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      const newX = e.clientX - offset.x;
      const newY = e.clientY - offset.y;
      updateBoxPosition(boxData.id, newX, newY);
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  useEffect(() => {
    if (dragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  return (
    <svg // Ensure that foreignObject is inside an SVG element
      x={boxData.x}
      y={boxData.y}
      width={width}
      height={height}
      onMouseDown={handleMouseDown}
      style={{ position: 'absolute', left: boxData.x, top: boxData.y, cursor: 'grab' }}
    >
      <foreignObject
        width={width}
        height={height}
        className="group drop-shadow-lg rounded-md"
      >
        <div
          className={`border-2 border-gray-500 hover:border-dashed hover:border-blue-500
               select-none rounded-lg w-full ${
                 boxData.selected
                   ? "border-solid border-blue-500"
                   : "border-gray-500"
               }`}
          style={{ direction: "ltr", backgroundColor: 'white', position: 'relative', cursor: 'move' }}
        >
          <div
            className="h-[10px] w-full rounded-t-md"
            style={{ backgroundColor: boxData.color }}
          />
          <div
            className={`overflow-hidden font-bold h-[40px] flex justify-between items-center border-b border-gray-400 ${
              "bg-zinc-200"
            }`}
          >
            <div className="px-3 overflow-hidden text-ellipsis whitespace-nowrap">
              {boxData.name}
            </div>
            <div className="hidden group-hover:block">
              <div className="flex justify-end items-center mx-2">
                <Button
                  ref={buttonRef} // Attach the ref to the button
                  icon={<IconEdit />}
                  size="small"
                  theme="solid"
                  style={{
                    backgroundColor: "#2f68adb3",
                    marginRight: "6px",
                  }}
                  onClick={() => console.log('Edit Box')}
                />
                <Popover
                  key={boxData.id}
                  content={
                    <div>
                      <Button
                        icon={<IconDeleteStroked />}
                        type="danger"
                        block
                        style={{ marginTop: "8px" }}
                        onClick={() => deleteBox(boxData.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  }
                  position="rightTop"
                  showArrow
                  trigger="click"
                  style={{ width: "200px", wordBreak: "break-word" }}
                >
                  <Button
                    icon={<IconMinus />}
                    type="tertiary"
                    size="small"
                    style={{
                      backgroundColor: "#808080b3",
                      color: "white",
                    }}
                  />
                </Popover>
              </div>
            </div>
          </div>
        </div>
      </foreignObject>
    </svg>
  );
}
