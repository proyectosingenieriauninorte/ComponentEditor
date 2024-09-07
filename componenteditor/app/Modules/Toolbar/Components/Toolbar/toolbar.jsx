import React, {memo} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMousePointer, faSquare, faDrawPolygon } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import Modes from '@Modules/Toolbar/Modes';

const Toolbar = ({ onSelectTool, selectedTool }) => {
  const buttons = [
    { mode: Modes.SELECT, icon: faMousePointer, title: 'Select' },
    { mode: Modes.NEW_BOX, icon: faSquare, title: 'New Box' },
    { mode: Modes.NEW_LINE, icon: faDrawPolygon, title: 'New Line' }
  ];

  return (
    <div className="toolbar">
      {buttons.map(({ mode, icon, title }) => (
        <button
          key={mode}
          onClick={() => onSelectTool(mode)}
          className={selectedTool === mode ? 'active' : ''}
          title={title}
        >
          <FontAwesomeIcon icon={icon} />
        </button>
      ))}
    </div>
  );
};

Toolbar.propTypes = {
  onSelectTool: PropTypes.func.isRequired,
  selectedTool: PropTypes.string.isRequired
};


export default memo(Toolbar);