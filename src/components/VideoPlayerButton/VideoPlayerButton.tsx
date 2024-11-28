import React from 'react';
import { styled } from '@stitches/react';
import { useTranscript } from '@/hooks/useTranscript';

const ButtonContainer = styled('div', {
  position: 'absolute',
  top: '12px',
  right: '12px',
  zIndex: 51
});

const IconButton = styled('button', {
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  border: 'none',
  borderRadius: '8px',
  padding: '8px 16px',
  color: 'white',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '14px',
  fontWeight: 500,
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    transform: 'translateY(-1px)'
  },
  '&.success': {
    backgroundColor: 'rgba(46, 125, 50, 0.9)'
  },
  '&.error': {
    backgroundColor: 'rgba(211, 47, 47, 0.9)'
  }
});

interface VideoPlayerButtonProps {
  videoId: string;
}

export const VideoPlayerButton: React.FC<VideoPlayerButtonProps> = ({ videoId }) => {
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
      >
        {loading ? '⌛' : success ? '✓ Copied!' : ' Copy Transcript'}
      </IconButton>
    </ButtonContainer>
  );
}; 