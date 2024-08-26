import React from "react";
import { Input } from "@douyinfe/semi-ui";

export default function PropertiesPanel({ selectedBox, onUpdateBox }) {
  if (!selectedBox) return <div className="properties-panel">Select a box to see properties</div>;

  return (
    <div className="properties-panel">
      <h3>Properties</h3>
      <div>
        <label>Name:</label>
        <Input
          value={selectedBox.name}
          onChange={(value) => onUpdateBox(selectedBox.id, { name: value })}
        />
      </div>
    </div>
  );
}
