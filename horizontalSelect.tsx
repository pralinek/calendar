import React from 'react';
import { Button, Menu, MenuItem, IconButton } from '@material-ui/core';
import { ArrowBack, ArrowForward } from '@material-ui/icons';

export default function HorizontalSelect() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setAnchorEl(null);
  };

  const options = ['Option 1', 'Option 2', 'Option 3']; // Add your options here

  const handleArrowClick = (direction) => {
    if (direction === 'left' && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    } else if (direction === 'right' && selectedIndex < options.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  return (
    <div>
      <IconButton onClick={() => handleArrowClick('left')}>
        <ArrowBack />
      </IconButton>
      <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
        {options[selectedIndex]}
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {options.map((option, index) => (
          <MenuItem
            key={option}
            selected={index === selectedIndex}
            onClick={(event) => handleMenuItemClick(event, index)}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
      <IconButton onClick={() => handleArrowClick('right')}>
        <ArrowForward />
      </IconButton>
    </div>
  );
}