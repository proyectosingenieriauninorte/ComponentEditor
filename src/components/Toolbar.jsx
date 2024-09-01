import React from "react";
import Modes from "../modes";

export default function Toolbar({ onSelectTool }) {
  return (
    <div className="toolbar">
      <button onClick={() => onSelectTool(Modes.SELECT)}>Select (Arrow)</button>
      <button onClick={() => onSelectTool(Modes.NEW_BOX)}>Add Box</button>
      <button onClick={() => onSelectTool(Modes.NEW_LINE)}>Add Line</button>
      {/* Add more tools as needed */}
    </div>
  );
}
