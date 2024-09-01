import React, { useState } from "react";
import Canvas from "./components/Canvas";
import Toolbar from "./components/Toolbar";
import PropertiesPanel from "./components/PropertiesPanel";
import { useCanvas } from "./hooks";  // Import from index.js

function App() {
  const [selectedTool, setSelectedTool] = useState(null);
  const [selectedBoxId, setSelectedBoxId] = useState(null);
  const { boxes, lines, addBox, updateBoxPosition, updateBox , deleteBox, addLine} = useCanvas();

  const handleSelectTool = (tool) => {
    setSelectedTool(tool);
  };

  const handleSelectBox = (id) => {
    console.log(`App.js Selected Box ID: ${id}`);
    setSelectedBoxId(id);
  };

  const handleAddBox = (x,y) => {
    if (selectedTool === "box") {
      console.log(`App.js Adding box at: (${x}, ${y})`);
      addBox(x,y);
      setSelectedTool(null);  // Reset tool after adding a box
    }
  };

  const handleUpdateBox = (id, updatedProperties) => {
    updateBox(id, updatedProperties);
  };

  const handleDeleteBox = (id) => {
    console.log(`App.js Deleting box with ID: ${id}`);
    setSelectedBoxId(null);
    deleteBox(id);
  }

  const handleAddLine = (startBoxId, endBoxId) => {
    console.log(`App.js Adding line between boxes: ${startBoxId} and ${endBoxId}`);
    if (startBoxId && endBoxId && startBoxId !== endBoxId) {
      addLine(startBoxId, endBoxId);
    }
  }

  const selectedBox = boxes.find((box) => box.id === selectedBoxId);

  return (
    <div className="app-container">
      <Toolbar onSelectTool={handleSelectTool} />
      <div className="main-layout">
        <PropertiesPanel
          selectedBox={selectedBox}
          onUpdateBox={handleUpdateBox}
        />
        <Canvas
          selectedTool={selectedTool}
          boxes={boxes}
          lines={lines}
          addBox={handleAddBox}  // Use handleAddBox to reset the tool after adding
          updateBoxPosition={updateBoxPosition}
          onSelectBox={handleSelectBox}
          deleteBox={handleDeleteBox}
          addLine={handleAddLine}
        />
      </div>
    </div>
  );
}

export default App;
