import React from 'react';
import { styled } from '@stitches/react';
import { useTranscript } from '@/hooks/useTranscript';
import { ClipboardList, Loader2, Check } from 'lucide-react';

const ButtonContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '6px',
  color: '#fff',
  fontSize: '12px',
  fontFamily: 'Roboto, Arial, sans-serif',
  userSelect: 'none',
});

const IconButton = styled('button', {
  backgroundColor: '#f2f2f2',
  border: 'none',
  padding: 0,
  width: '49px',
  height: '49px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: '#0f0f0f',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: '#a3a3a3',
    transform: 'scale(1.1)',
  },
  '& svg': {
    width: '24px',
    height: '24px',
    strokeWidth: 2,
  },
  '&.loading svg': {
    animation: 'spin 1s linear infinite',
  },
  '&.success': {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    color: '#10B981',
  },
});

const Label = styled('span', {
  textAlign: 'center',
  lineHeight: '14px',
  fontWeight: '500',
});

// Add keyframes for loading spinner
const keyframes = `
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

// Insert keyframes into document
const style = document.createElement('style');
style.textContent = keyframes;
document.head.appendChild(style);

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
        className={loading ? 'loading' : success ? 'success' : ''}
        title="Copy transcript"
      >
        {loading ? (
          <Loader2 />
        ) : success ? (
          <Check />
        ) : (
          <ClipboardList />
        )}
      </IconButton>
      <Label>Transcript</Label>
    </ButtonContainer>
  );
};
