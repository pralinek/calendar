import React, { MouseEvent, useState } from 'react';
import { Button, Menu, MenuItem, IconButton } from '@material-ui/core';
import { ArrowBack, ArrowForward } from '@material-ui/icons';

interface OptionItem {
  value: string;
  label: string;
}

const options: OptionItem[] = [
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2' },
  { value: '3', label: 'Option 3' },
]; // Add your options here

export default function HorizontalSelect() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(1);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (event: MouseEvent<HTMLElement>, index: number) => {
    setSelectedIndex(index);
    setAnchorEl(null);
  };

  const handleArrowClick = (direction: 'left' | 'right') => {
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
        {options[selectedIndex].label}
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
            key={option.value}
            selected={index === selectedIndex}
            onClick={(event) => handleMenuItemClick(event, index)}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
      <IconButton onClick={() => handleArrowClick('right')}>
        <ArrowForward />
      </IconButton>
    </div>
  );
}