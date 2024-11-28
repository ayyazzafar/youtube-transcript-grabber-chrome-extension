import { styled } from '@stitches/react';

export const ButtonContainer = styled('div', {
  position: 'absolute',
  top: '8px',
  right: '8px',
  zIndex: 1000,
  
  '&:hover': {
    transform: 'scale(1.05)',
    transition: 'transform 0.2s ease-in-out'
  }
});


export const IconButton = styled('button', {
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  border: 'none',
  borderRadius: '50%',
  padding: '8px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.8)'
  },
  
  '&:disabled': {
    opacity: 0.5,
    cursor: 'not-allowed'
  }
});