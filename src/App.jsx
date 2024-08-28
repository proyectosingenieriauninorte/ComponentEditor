import React, { useState } from "react";
import Canvas from "./components/Canvas";
import Toolbar from "./components/Toolbar";
import PropertiesPanel from "./components/PropertiesPanel";
import { useCanvas } from "./hooks";

function App() {
  const [selectedTool, setSelectedTool] = useState(null);
  const [selectedBoxId, setSelectedBoxId] = useState(null);
  const { boxes, lines, addBox, updateBoxPosition, deleteBox } = useCanvas();

  const handleSelectTool = (tool) => {
    setSelectedTool(tool);
  };

  const handleSelectBox = (id) => {
    setSelectedBoxId(id);
  };

  const handleAddBox = () => {
    if (selectedTool === "box") {
      addBox();
      setSelectedTool(null); // Reset tool after adding a box
    }
  };

  const selectedBox = boxes.find((box) => box.id === selectedBoxId);

  return (
    <div className="app-container">
      <Toolbar onSelectTool={handleSelectTool} />
      <div className="main-layout">
        <PropertiesPanel selectedBox={selectedBox} onUpdateBox={updateBoxPosition} />
        <Canvas
          selectedTool={selectedTool}
          boxes={boxes}
          lines={lines}
          addBox={handleAddBox}  // Use handleAddBox to reset the tool after adding
          updateBoxPosition={updateBoxPosition}
          deleteBox={deleteBox}
          onSelectBox={handleSelectBox}
        />
      </div>
    </div>
  );
}

export default App;
