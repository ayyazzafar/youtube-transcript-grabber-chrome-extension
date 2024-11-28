import React, { useState } from 'react';
import { useTranscript } from '@/hooks/useTranscript';
import { ButtonContainer } from './styles';

interface TranscriptButtonProps {
  videoId: string;
  buttonType?: 'thumbnail' | 'title';
}

export const TranscriptButton: React.FC<TranscriptButtonProps> = ({ videoId, buttonType }) => {
  const { grabTranscript, loading, error, success } = useTranscript();
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await grabTranscript(videoId);
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 2000);
  };

  const getButtonClass = () => {
    if (loading) return 'transcript-button loading';
    if (error) return 'transcript-button error';
    if (success) return 'transcript-button success';
    return 'transcript-button';
  };

  const getTooltipText = () => {
    if (error) return error;
    if (success) return 'Copied to clipboard!';
    return 'Copy transcript';
  };

  return (
    <ButtonContainer css={{
      top: buttonType === 'title' ? '-13px' : '8px',
      right: buttonType === 'title' ? '30px' : '8px',
    }}>
      <button
        onClick={handleClick}
        className={getButtonClass()}
        disabled={loading}
        title={getTooltipText()}
      >
        📝
      </button>
      {showTooltip && (
        <div className="tooltip">
          {getTooltipText()}
        </div>
      )}
    </ButtonContainer>
  );
}; 