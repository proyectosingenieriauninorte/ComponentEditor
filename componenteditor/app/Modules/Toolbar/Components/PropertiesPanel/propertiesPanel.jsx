import React, { Component } from "react";
import "./propertiesPanel.css";

class PropertiesPanel extends Component {
  constructor(props) {
    super(props);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleColorChange = this.handleColorChange.bind(this);
  }

  handleNameChange(e) {
    const updatedName = e.target.value;
    const { selectedBox, onUpdateBox } = this.props;
    onUpdateBox(selectedBox.id, {
      ...selectedBox,
      name: updatedName,
    });
  }

  handleColorChange(e) {
    const updatedColor = e.target.value;
    const { selectedBox, onUpdateBox } = this.props;
    onUpdateBox(selectedBox.id, {
      ...selectedBox,
      color: updatedColor,
    });
  }

  render() {
    const { selectedBox } = this.props;

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
            onChange={this.handleNameChange}
          />
        </div>
        <div> 
          <label>Inputs</label>
          <input 
            type="number"
            name="inputs"
            value={selectedBox.inputs || 2}
            onChange={this.handleInputChange}
            min="1"
            /> 
        </div>
        <div> 
          <label>Outputs</label>
          <input
            type="number"
            name="outputs"
            value={selectedBox.outputs || 2}
            onChange={this.handleOutputChange}
            min="1"
          />
        </div> 
        <div>
          <label>Color:</label>
          <input
            type="color"
            value={selectedBox.color || "#000000"}
            onChange={this.handleColorChange}
          />
        </div>
        {/* Other properties can be added here */}
      </div>
    );
  }
}

export default PropertiesPanel;