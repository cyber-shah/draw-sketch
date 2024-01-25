
import React from 'react';
import IconButton from '@mui/material/IconButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ToolbarIconButton = ({ active, onClick, icon }) => {
  return (
    <IconButton
      color={active ? 'primary' : 'inherit'}
      onClick={onClick}
    >
      <FontAwesomeIcon icon={icon} />
    </IconButton>
  );
};

export default ToolbarIconButton;
