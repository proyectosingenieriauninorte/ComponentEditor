import React, { useState } from "react";
import Canvas from "./components/Canvas";
import Toolbar from "./components/Toolbar";
import PropertiesPanel from "./components/PropertiesPanel";
import { useCanvas } from "./hooks";  // Import from index.js
import Modes from "./modes";

function App() {
  const [selectedTool, setSelectedTool] = useState(Modes.SELECT);
  const [selectedBoxId, setSelectedBoxId] = useState(null);
  const { boxes, lines, addBox, updateBoxPosition, updateBox, deleteBox, addLine, selectBox } = useCanvas();

  const handleSelectTool = (tool) => {
    console.log(`App.js Selected Tool: ${tool}`);
    setSelectedTool(tool);
    selectBox(null); // Clear the selection when changing modes
  };

  const handleSelectBox = (id) => {
    console.log(`App.js Selected Box ID: ${id}`);
    selectBox(id);
  };

  const handleAddBox = (x, y) => {
    if (selectedTool === Modes.NEW_BOX) {
      console.log(`App.js Adding box at: (${x}, ${y})`);
      addBox(x, y);
      setSelectedTool(Modes.SELECT);  // Reset tool after adding a box
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

  const handleAddLine = (startBoxId, endBoxId, startHook, endHook) => {
    console.log(`App.js Adding line between boxes: ${startBoxId} and ${endBoxId} from ${startHook} to ${endHook}`);
    if (startBoxId && endBoxId && startHook && endHook ) {
      addLine({ startBoxId, endBoxId, startHook, endHook });
      setSelectedTool(Modes.SELECT);  // Reset tool after adding a box
    } else {
      console.error("App.js Invalid parameters for adding a line", { startBoxId, endBoxId, startHook, endHook });
    }
  }

  const selectedBox = boxes.find((box) => box.id === selectedBoxId);

  const clearSelection = () => {
    console.log(`App.js Clearing selection ${selectedBoxId}`);
    //selectBox(null);  // TODO: Uncomment this line when fix the issue that allows the canvas to be clicked when a box is clicked  
  };

  return (
    <div className="app-container">
      <Toolbar onSelectTool={handleSelectTool} selectedTool={selectedTool} />
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
          onAddLine={handleAddLine}
          clearSelection={clearSelection}
        />
      </div>
    </div>
  );
}

export default App;
