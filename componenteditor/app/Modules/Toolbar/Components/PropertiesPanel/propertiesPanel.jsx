import React, { Component } from "react";
import "./propertiesPanel.css";

class PropertiesPanel extends Component {
  constructor(props) {
    super(props);
    const { selectedBox } = props;

    this.state = {  
      updatedName: selectedBox ? selectedBox.name : "",
      error: {
        message: '',
        type: ''
      }
    };
    
    this.inputNameRef = React.createRef();
  }

  componentDidUpdate(prevProps) {
    const { selectedBox } = this.props;
    if (prevProps.selectedBox !== selectedBox) {
      this.setState({
        updatedName: selectedBox ? selectedBox.name : ""
      });
    }
  }

  handleNameChange = (e) => {
    this.setState({ updatedName: e.target.value });
  };

  handleNameUpdate = () => {
    const { selectedBox, onUpdateBox, isBoxNameUnique } = this.props;
    const { updatedName } = this.state;

    if (!updatedName.trim()) {
      this.setError({ message: 'Name cannot be empty',  type: 'name'});
      return;
    }

    if (!isBoxNameUnique(updatedName) && selectedBox.name !== updatedName) {
      this.setError({ message: 'Name must be unique',  type: 'name'});
      return;
    }

    this.clearError();

    onUpdateBox(selectedBox.id, {
      ...selectedBox,
      name: updatedName,
    });
  };

  handleNameInputKeyDown = (e) => {
    if (e.key === "Enter") {
      this.handleNameUpdate();
    }
  };

  handleDimensionChange = (dimension) => (e) => {
    const updatedValue = parseInt(e.target.value, 10);
    const { selectedBox, onUpdateBox } = this.props;

    onUpdateBox(selectedBox.id, {
      ...selectedBox,
      [dimension]: updatedValue,
    });
  };

  setError = ({ message, type }) => {
    this.setState({ error: { message, type } });
  };

  clearError = () => {
    if (this.state.error.type === 'name') {
      this.clearNameError();
    }
    this.setState({ error: { message: '', type: '' } });
  };

  clearNameError = () => {
    this.inputNameRef.current.focus();
  };

  handleColorChange = (e) => {
    const updatedColor = e.target.value;
    const { selectedBox, onUpdateBox } = this.props;
    onUpdateBox(selectedBox.id, {
      ...selectedBox,
      color: updatedColor,
    });
  }

  handleInputChange = (e) => {
    const updatedInputs = Math.max(1, parseInt(e.target.value, 10));
    const { selectedBox, onUpdateBox } = this.props;
    onUpdateBox(selectedBox.id, {
      ...selectedBox,
      inputs: updatedInputs,
    });
  };

  handleOutputChange = (e) => {
    const updatedOutputs = Math.max(1, parseInt(e.target.value, 10));
    const { selectedBox, onUpdateBox } = this.props;
    onUpdateBox(selectedBox.id, {
      ...selectedBox,
      outputs: updatedOutputs,
    });
  };

  render() {
    const { selectedBox } = this.props;
    const { updatedName, error } = this.state;

    if (!selectedBox) {
      return <div className="properties-panel">No box selected</div>;
    }

    return (
      <div className="properties-panel">
        {error.message && (
          <div className="properties-error">
            <p className="properties-error-message">{error.message}</p>
            <button className="properties-error-button" onClick={this.clearError}>Close</button>
          </div>
        )}
        <h3>Properties</h3>
        <section>
          <div>
            <label>Name:</label>
            <input
              type="text"
              value={updatedName}
              onChange={this.handleNameChange}
              onBlur={this.handleNameUpdate}
              onKeyDown={this.handleNameInputKeyDown}
              ref={this.inputNameRef}
            />
          </div>
          <div>
            <label>Width:</label>
            <input
              type="number"
              value={selectedBox.width}
              onChange={this.handleDimensionChange('width')}
            />
          </div>
          <div>
            <label>Height:</label>
            <input
              type="number"
              value={selectedBox.height}
              onChange={this.handleDimensionChange('height')}
            />
          </div>
          <div> 
            <label>Inputs</label>
            <input 
              type="number"
              name="inputs"
              value={selectedBox.inputs || 1}
              onChange={this.handleInputChange}
              min="1" 
            /> 
          </div>
          <div> 
            <label>Outputs</label>
            <input
              type="number"
              name="outputs"
              value={selectedBox.outputs || 1}
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
        </section>
      </div>
    );
  }
}

export default PropertiesPanel;
