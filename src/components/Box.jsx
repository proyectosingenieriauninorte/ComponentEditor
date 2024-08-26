import { useState } from "react";
import { Input } from "@douyinfe/semi-ui";

export default function Box({ data, onPointerDown, handleGripField, setLinkingLine }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(data.name);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    // Update the box name in the parent component or context here if needed.
  };

  return (
    <foreignObject
      x={data.x}
      y={data.y}
      width={150}
      height={50}
      onPointerDown={onPointerDown}
      className="cursor-pointer"
    >
      <div
        className="border border-gray-400 bg-white p-2 rounded"
        onDoubleClick={handleDoubleClick}
      >
        {isEditing ? (
          <Input
            value={name}
            onChange={setName}
            onBlur={handleBlur}
            autoFocus
          />
        ) : (
          <span>{name}</span>
        )}
        <button
          className="absolute right-0 bottom-0 m-1 p-1 rounded-full bg-blue-500"
          onPointerDown={(e) => {
            e.stopPropagation();
            handleGripField();
            setLinkingLine({ startBoxId: data.id, startX: data.x + 75, startY: data.y + 25 });
          }}
        />
      </div>
    </foreignObject>
  );
}
