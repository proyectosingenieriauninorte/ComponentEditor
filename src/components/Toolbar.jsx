import React from "react";
import { IconBox, IconLink } from "@douyinfe/semi-icons";

export default function Toolbar({ onSelectTool }) {
  return (
    <div className="toolbar">
      <button onClick={() => onSelectTool("box")}>
        <IconBox size="large" style={{ color: 'white' }} />
      </button>
      <button onClick={() => onSelectTool("line")}>
        <IconLink size="large" style={{ color: 'white' }} />
      </button>
    </div>
  );
}
