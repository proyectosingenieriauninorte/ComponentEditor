import React, { useState } from "react";
import Canvas from "./components/Canvas";
import Toolbar from "./components/Toolbar";
import PropertiesPanel from "./components/PropertiesPanel";
import { useCanvas } from "./hooks";

function App() {
  const [selectedTool, setSelectedTool] = useState(null);
  const [selectedBoxId, setSelectedBoxId] = useState(null);
  const { boxes, lines, addBox, addLine, updateBox } = useCanvas();

  const handleSelectTool = (tool) => {
    setSelectedTool(tool);
  };

  const handleSelectBox = (id) => {
    setSelectedBoxId(id);
  };

  const selectedBox = boxes.find((box) => box.id === selectedBoxId);

  return (
    <div className="app-container">
      <Toolbar onSelectTool={handleSelectTool} />
      <div className="main-layout">
        <PropertiesPanel selectedBox={selectedBox} onUpdateBox={updateBox} />
        <Canvas
          selectedTool={selectedTool}
          boxes={boxes}
          lines={lines}
          addBox={addBox}
          addLine={addLine}
          onSelectBox={handleSelectBox}
        />
      </div>
    </div>
  );
}

export default App;
