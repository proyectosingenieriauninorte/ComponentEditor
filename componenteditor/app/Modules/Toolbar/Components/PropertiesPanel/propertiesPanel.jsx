import React, { Component } from "react";
import "./propertiesPanel.css";

class PropertiesPanel extends Component {
  constructor(props) {
    super(props);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleWidthChange = this.handleWidthChange.bind(this);
    this.handleHeightChange = this.handleHeightChange.bind(this);
    
  }

  handleNameChange(e) {
    const updatedName = e.target.value;
    const { selectedBox, onUpdateBox } = this.props;
    onUpdateBox(selectedBox.id, {
      ...selectedBox,
      name: updatedName,
    });
  }

  handleWidthChange(e) {
    const updatedWidth = e.target.value;
    const { selectedBox, onUpdateBox } = this.props;
    console.log(selectedBox);
    console.log(onUpdateBox); 
    onUpdateBox(selectedBox.id, {
      ...selectedBox,
      width: parseInt(updatedWidth),
    });
  }

  handleHeightChange(e) {
    const updatedHeight = e.target.value;
    const { selectedBox, onUpdateBox } = this.props;
    onUpdateBox(selectedBox.id, {
      ...selectedBox,
      height: parseInt(updatedHeight)
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
        <section>
          <div>
            <label>Name:</label>
            <input
              type="text"
              value={selectedBox.name}
              onChange={this.handleNameChange}
            />
          </div>
          <div>
            <label>Width:</label>
            <input
              type="number"
              value={selectedBox.width}
              onChange={this.handleWidthChange}
            />
          </div>
          <div>
            <label>Height:</label>
            <input
              type="number"
              value={selectedBox.height}
              onChange={this.handleHeightChange}
            />
          </div>
        </section>
      </div>
    );
  }
}

export default PropertiesPanel;