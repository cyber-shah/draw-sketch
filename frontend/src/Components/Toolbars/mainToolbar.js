import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faSquare, faCircle, faFont, faSave, faEraser, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const DrawingToolbar = () => {
  const [activeIcon, setActiveIcon] = useState(null);

  const handleIconClick = (icon) => {
    setActiveIcon(icon === activeIcon ? null : icon);
    // Add your logic here for handling the click event for each icon
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
          maxWidth: '600px',
          borderRadius: '16px',
          background: '#f5f5f5',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          position: 'relative',
        }}
      >
        <Toolbar>
          <IconButton
            color={activeIcon === 'pencil' ? 'primary' : 'inherit'}
            onClick={() => handleIconClick('pencil')}
          >
            <FontAwesomeIcon icon={faPencilAlt} />
          </IconButton>
          <IconButton
            color={activeIcon === 'square' ? 'primary' : 'inherit'}
            onClick={() => handleIconClick('square')}
          >
            <FontAwesomeIcon icon={faSquare} />
          </IconButton>
          <IconButton
            color={activeIcon === 'circle' ? 'primary' : 'inherit'}
            onClick={() => handleIconClick('circle')}
          >
            <FontAwesomeIcon icon={faCircle} />
          </IconButton>
          <IconButton
            color={activeIcon === 'font' ? 'primary' : 'inherit'}
            onClick={() => handleIconClick('font')}
          >
            <FontAwesomeIcon icon={faFont} />
          </IconButton>
          <IconButton
            color={activeIcon === 'save' ? 'primary' : 'inherit'}
            onClick={() => handleIconClick('save')}
          >
            <FontAwesomeIcon icon={faSave} />
          </IconButton>
          <IconButton
            color={activeIcon === 'eraser' ? 'primary' : 'inherit'}
            onClick={() => handleIconClick('eraser')}
          >
            <FontAwesomeIcon icon={faEraser} />
          </IconButton>
          <IconButton
            color={activeIcon === 'trash' ? 'primary' : 'inherit'}
            onClick={() => handleIconClick('trash')}
          >
            <FontAwesomeIcon icon={faTrashAlt} />
          </IconButton>
        </Toolbar>
      </Paper>
    </Box>
  );
};

export default DrawingToolbar;

