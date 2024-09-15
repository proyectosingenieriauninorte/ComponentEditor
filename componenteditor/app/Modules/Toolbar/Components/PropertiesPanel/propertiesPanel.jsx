import React, { Component } from "react";
import "./propertiesPanel.css";

class PropertiesPanel extends Component {
  constructor(props) {
    super(props);
    this.handleNameChange = this.handleNameChange.bind(this);
  }

  handleNameChange(e) {
    const updatedName = e.target.value;
    const { selectedBox, onUpdateBox } = this.props;
    onUpdateBox(selectedBox.id, {
      ...selectedBox,
      name: updatedName,
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
        {/* Other properties can be added here */}
      </div>
    );
  }
}

export default PropertiesPanel;