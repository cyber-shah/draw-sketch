import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import { faPencilAlt, faSquare, faCircle, faFont, faSave, faEraser, faTrashAlt, faUndo, faMousePointer } from '@fortawesome/free-solid-svg-icons';
import ToolbarIconButton from './toolbarIconButton';
import ExtendedToolbar from './extendedToolbar';


const iconsData = [
  // { key: 'undo', icon: faUndo, tooltip: 'Undo', colorPicker: false, brushSizePicker: false },
  { key: 'pointer', icon: faMousePointer, tooltip: 'pointer', colorPicker: false, brushSizePicker: false },
  { key: 'pencil', icon: faPencilAlt, tooltip: 'Pencil', colorPicker: true, brushSizePicker: true },
  { key: 'save', icon: faSave, tooltip: 'Save', colorPicker: false, brushSizePicker: false },
  { key: 'eraser', icon: faEraser, tooltip: 'Eraser', colorPicker: false, brushSizePicker: true },
  { key: 'trash', icon: faTrashAlt, tooltip: 'Trash', colorPicker: false, brushSizePicker: false },
];


const DrawingToolbar = (props) => {

  // handles the click and sets the active icon
  const handleIconClick = (icon) => {
    props.setSelectedTool(icon === props.selectedTool ? null : icon);
  };

  // returns the data of the selected tool
  const getSelectedToolData = () => {
    return iconsData.find((tool) => tool.key === props.selectedTool) || {};
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
          borderRadius: '20px',
          background: '#f5f5f5',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          position: 'relative',
        }}
      >
        <Toolbar>
          {iconsData.map(({ key, icon, tooltip }) => (
            <ToolbarIconButton
              key={key}
              active={props.selectedTool === key}
              onClick={() => {
                if (key === 'save') {
                  props.handleSaveClick();
                } else {
                  handleIconClick(key);
                }
              }}
              icon={icon}
              tooltip={tooltip}
            />
          ))}

          {props.selectedTool
            && <ExtendedToolbar
              setSelectedColor={props.setSelectedColor}
              selectedColor={props.selectedColor}
              setBrushSize={props.setBrushSize}
              brushSize={props.brushSize}
              toolData={getSelectedToolData()}
            />
          }

        </Toolbar>
      </Paper>
    </Box>
  );
};


export default DrawingToolbar;
