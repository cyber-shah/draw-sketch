import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import { faPencilAlt, faSquare, faCircle, faFont, faSave, faEraser, faTrashAlt, faUndo, faRedo } from '@fortawesome/free-solid-svg-icons';
import ToolbarIconButton from './toolbarIconButton';
import ExtendedToolbar from './extendedToolbar';



const iconsData = [
  { key: 'undo', icon: faUndo, tooltip: 'Undo', colorPicker: false, brushSizePicker: false },
  { key: 'pencil', icon: faPencilAlt, tooltip: 'Pencil', colorPicker: true, brushSizePicker: true },
  { key: 'square', icon: faSquare, tooltip: 'Square', colorPicker: true, brushSizePicker: true },
  { key: 'circle', icon: faCircle, tooltip: 'Circle', colorPicker: true, brushSizePicker: true },
  { key: 'font', icon: faFont, tooltip: 'Font', colorPicker: true, brushSizePicker: false },
  { key: 'save', icon: faSave, tooltip: 'Save', colorPicker: false, brushSizePicker: false },
  { key: 'eraser', icon: faEraser, tooltip: 'Eraser', colorPicker: false, brushSizePicker: true },
  { key: 'trash', icon: faTrashAlt, tooltip: 'Trash', colorPicker: false, brushSizePicker: false },
  { key: 'redo', icon: faRedo, tooltip: 'Redo', colorPicker: false, brushSizePicker: false },

];

const DrawingToolbar = () => {
  const [activeIcon, setActiveIcon] = useState(null);

  const handleIconClick = (icon) => {
    setActiveIcon(icon === activeIcon ? null : icon);
  };

  const getSelectedToolData = () => {
    return iconsData.find((tool) => tool.key === activeIcon) || {};
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Paper
        elevation={2}
        style={{
          maxWidth: '900px',
          borderRadius: '16px',
          background: '#f5f5f5',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          position: 'relative',
        }}
      >
        <Toolbar>
          {iconsData.map(({ key, icon, tooltip }) => (
            <ToolbarIconButton
              key={key}
              active={activeIcon === key}
              onClick={() => handleIconClick(key)}
              icon={icon}
              tooltip={tooltip}
            />
          ))}
          {activeIcon && <ExtendedToolbar toolData={getSelectedToolData()} />}
        </Toolbar>
      </Paper>
    </Box>
  );
};

export default DrawingToolbar;
