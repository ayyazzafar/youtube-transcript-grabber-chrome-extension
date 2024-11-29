import React from 'react';
import { styled } from '@stitches/react';
import { useTranscript } from '@/hooks/useTranscript';

const ButtonContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '48px',
  height: '48px',
  margin: '8px 0',
  position: 'relative',
  '@media (max-width: 600px)': {
    width: '40px',
    height: '40px',
  }
});

const IconButton = styled('button', {
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  border: 'none',
  borderRadius: '50%',
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: 'white',
  fontSize: '20px',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    transform: 'scale(1.1)'
  },
  '&.success': {
    backgroundColor: 'rgba(46, 125, 50, 0.9)'
  },
  '&.error': {
    backgroundColor: 'rgba(211, 47, 47, 0.9)'
  }
});

interface ShortsPlayerButtonProps {
  videoId: string;
}

export const ShortsPlayerButton: React.FC<ShortsPlayerButtonProps> = ({ videoId }) => {
  const { grabTranscript, loading, success } = useTranscript();

  const handleClick = async () => {
    await grabTranscript(videoId);
  };

  return (
    <ButtonContainer>
      <IconButton
        onClick={handleClick}
        disabled={loading}
        className={success ? 'success' : ''}
        title="Copy transcript"
      >
        {loading ? '⌛' : success ? '✓' : '📝'}
      </IconButton>
    </ButtonContainer>
  );
};
