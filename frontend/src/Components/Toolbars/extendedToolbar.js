import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';

// Updated ExtendedToolbar component
const ExtendedToolbar = (props) => {


  // Function to handle color change
  const handleColorChange = (color) => {
    props.setSelectedColor(color);
    console.log(color);
  };

  // Function to handle brush size change
  const handleBrushSizeChange = (size) => {
    props.setBrushSize(size);
    console.log(size);
  };

  return (
    <Toolbar>
      {/* Render color picker if colorPicker is true for the selected tool */}
      {props.toolData.colorPicker && (
        <input
          type="color"
          value={props.selectedColor}
          onChange={(e) => handleColorChange(e.target.value)}
        />
      )}

      {/* Render brush size picker if brushSizePicker is true for the selected tool */}
      {props.toolData.brushSizePicker && (
        <input
          type="range"
          min="1"
          max="10"
          value={props.brushSize}
          onChange={(e) => handleBrushSizeChange(parseInt(e.target.value))}
        />
      )}
    </Toolbar>
  );
};

export default ExtendedToolbar;

