import React, { useState } from 'react';
import { styled, keyframes } from '@stitches/react';
import { TranscriptResponse } from '@/types/youtube';

const slideIn = keyframes({
  '0%': { transform: 'translateX(100%)' },
  '100%': { transform: 'translateX(0)' }
});

const fadeIn = keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 1 }
});

const SidebarContainer = styled('div', {
  position: 'fixed',
  top: 0,
  right: 0,
  width: '360px',
  height: '100vh',
  backgroundColor: 'white',
  boxShadow: '-2px 0 12px rgba(0,0,0,0.1)',
  zIndex: 9999,
  display: 'flex',
  flexDirection: 'column',
  transform: 'translateX(100%)',
  transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&.open': {
    transform: 'translateX(0)',
    animation: `${slideIn} 0.3s cubic-bezier(0.4, 0, 0.2, 1)`
  }
});

const Header = styled('div', {
  padding: '20px',
  borderBottom: '1px solid #f0f0f0',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '#fff',
  position: 'sticky',
  top: 0,
  zIndex: 1,
  backdropFilter: 'blur(8px)',
  '& h3': {
    margin: 0,
    fontSize: '18px',
    fontWeight: 500,
    color: '#1f1f1f'
  }
});

const Content = styled('div', {
  flex: 1,
  overflowY: 'auto',
  padding: '16px',
  '&::-webkit-scrollbar': {
    width: '8px'
  },
  '&::-webkit-scrollbar-track': {
    background: '#f1f1f1'
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#c1c1c1',
    borderRadius: '4px',
    '&:hover': {
      background: '#a8a8a8'
    }
  }
});

const Segment = styled('div', {
  marginBottom: '16px',
  padding: '12px',
  borderRadius: '8px',
  backgroundColor: '#f8f9fa',
  transition: 'all 0.2s ease',
  fontSize: '14px',
  lineHeight: '1.5',
  color: '#3c4043',
  '&:hover': {
    backgroundColor: '#f1f3f4',
    transform: 'translateX(4px)'
  }
});

const Actions = styled('div', {
  padding: '16px',
  borderTop: '1px solid #f0f0f0',
  display: 'flex',
  gap: '12px',
  backgroundColor: '#fff'
});

const Button = styled('button', {
  padding: '10px 20px',
  borderRadius: '8px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 500,
  transition: 'all 0.2s ease',
  '&.primary': {
    backgroundColor: '#1a73e8',
    color: 'white',
    '&:hover': {
      backgroundColor: '#1557b0',
      transform: 'translateY(-1px)'
    }
  },
  '&.secondary': {
    backgroundColor: '#f1f3f4',
    color: '#3c4043',
    '&:hover': {
      backgroundColor: '#e8eaed'
    }
  }
});

const SuccessMessage = styled('div', {
  position: 'fixed',
  bottom: '24px',
  right: '24px',
  padding: '12px 24px',
  backgroundColor: '#4caf50',
  color: 'white',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
  animation: `${fadeIn} 0.3s ease`,
  zIndex: 10000
});

interface TranscriptSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  transcript: TranscriptResponse | null;
  onCopy: () => void;
}

export const TranscriptSidebar: React.FC<TranscriptSidebarProps> = ({
  isOpen,
  onClose,
  transcript,
  onCopy
}) => {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleCopy = async () => {
    await onCopy();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <>
      <SidebarContainer className={isOpen ? 'open' : ''}>
        <Header>
          <h3>Transcript</h3>
          <Button className="secondary" onClick={onClose}>✕</Button>
        </Header>
        <Content>
          {!transcript && (
            <div className="loading">Loading transcript...</div>
          )}
          {transcript?.error && (
            <div className="error">{transcript.error}</div>
          )}
          {transcript?.success && transcript.segments.map((segment, index) => (
            <Segment key={index}>
              {segment.text}
            </Segment>
          ))}
        </Content>
        {transcript?.success && (
          <Actions>
            <Button className="primary" onClick={handleCopy}>
              Copy to Clipboard
            </Button>
            <Button className="secondary" onClick={onClose}>
              Close
            </Button>
          </Actions>
        )}
      </SidebarContainer>
      {showSuccess && (
        <SuccessMessage>
          ✓ Copied to clipboard!
        </SuccessMessage>
      )}
    </>
  );
}; 