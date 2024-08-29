import React from "react";

export default function PropertiesPanel({ selectedBox, onUpdateBox }) {
  const handleNameChange = (e) => {
    const updatedName = e.target.value;
    onUpdateBox(selectedBox.id, {
      ...selectedBox,
      name: updatedName,
    });
  };

  if (!selectedBox) {
    return <div className="properties-panel">No box selected</div>;
  }

  return (
    <div className="properties-panel">
      <h3>Properties</h3>
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={selectedBox.name}
          onChange={handleNameChange}
        />
      </div>
      {/* Other properties can be added here */}
    </div>
  );
}
