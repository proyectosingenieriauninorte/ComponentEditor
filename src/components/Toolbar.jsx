import React from "react";

export default function Toolbar({ onSelectTool }) {
  return (
    <div className="toolbar">
      <button onClick={() => onSelectTool("box")}>Add Box</button>
      <button onClick={() => onSelectTool("line")}>Add Line</button>
      {/* Add more tools as needed */}
    </div>
  );
}
