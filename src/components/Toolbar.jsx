import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMousePointer, faSquare, faDrawPolygon } from '@fortawesome/free-solid-svg-icons';
import Modes from "../modes";

export default function Toolbar({ onSelectTool, selectedTool }) {
  return (
    <div className="toolbar">
      <button
        onClick={() => onSelectTool(Modes.SELECT)}
        className={selectedTool === Modes.SELECT ? "active" : ""}
        title="Select"
      >
        <FontAwesomeIcon icon={faMousePointer} />
      </button>
      <button
        onClick={() => onSelectTool(Modes.NEW_BOX)}
        className={selectedTool === Modes.NEW_BOX ? "active" : ""}
        title="New Box"
      >
        <FontAwesomeIcon icon={faSquare} />
      </button>
      <button
        onClick={() => onSelectTool(Modes.NEW_LINE)}
        className={selectedTool === Modes.NEW_LINE ? "active" : ""}
        title="New Line"
      >
        <FontAwesomeIcon icon={faDrawPolygon} />
      </button>
    </div>
  );
}
