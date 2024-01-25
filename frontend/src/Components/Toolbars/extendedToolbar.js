import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';

// Updated ExtendedToolbar component
const ExtendedToolbar = ({ toolData }) => {
  const [selectedColor, setSelectedColor] = useState('#000000'); // Default color is black
  const [brushSize, setBrushSize] = useState(5); // Default brush size is 5

  // Function to handle color change
  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  // Function to handle brush size change
  const handleBrushSizeChange = (size) => {
    setBrushSize(size);
  };

  return (
    <Toolbar>
      {/* Render color picker if colorPicker is true for the selected tool */}
      {toolData.colorPicker && (
        <input
          type="color"
          value={selectedColor}
          onChange={(e) => handleColorChange(e.target.value)}
        />
      )}

      {/* Render brush size picker if brushSizePicker is true for the selected tool */}
      {toolData.brushSizePicker && (
        <input
          type="range"
          min="1"
          max="10"
          value={brushSize}
          onChange={(e) => handleBrushSizeChange(parseInt(e.target.value))}
        />
      )}
    </Toolbar>
  );
};

export default ExtendedToolbar;

