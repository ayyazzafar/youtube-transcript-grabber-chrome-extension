import React, { useState, useEffect } from 'react';
import { useTranscript } from '@/hooks/useTranscript';
import { ButtonContainer } from './styles';
import { TranscriptService, CaptionTrack } from '@/services/transcript';

interface TranscriptButtonProps {
  videoId: string;
  buttonType?: 'thumbnail' | 'title';
}

export const TranscriptButton: React.FC<TranscriptButtonProps> = ({ videoId, buttonType }) => {
  const { grabTranscript, loading, error, success } = useTranscript();
  const [showTooltip, setShowTooltip] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);
  const [languages, setLanguages] = useState<CaptionTrack[]>([]);

  useEffect(() => {
    const fetchLanguages = async () => {
      const transcriptService = TranscriptService.getInstance();
      const availableLanguages = await transcriptService.getAvailableLanguages(videoId);
      setLanguages(availableLanguages);
    };
    fetchLanguages();
  }, [videoId]);

  const handleClick = async (e: React.MouseEvent, languageCode?: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!languageCode && languages.length > 1) {
      setShowLanguages(!showLanguages);
      return;
    }
    
    await grabTranscript(videoId, languageCode);
    setShowTooltip(true);
    setShowLanguages(false);
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
        onClick={(e) => handleClick(e)}
        className={getButtonClass()}
        disabled={loading}
        title={getTooltipText()}
      >
        📝
      </button>
      {showLanguages && languages.length > 0 && (
        <div className="language-menu">
          {languages.map((lang) => (
            <button
              key={lang.languageCode}
              onClick={(e) => handleClick(e, lang.languageCode)}
              className="language-option"
            >
              {lang.name.simpleText}
            </button>
          ))}
        </div>
      )}
      {showTooltip && (
        <div className="tooltip">
          {getTooltipText()}
        </div>
      )}
    </ButtonContainer>
  );
}; 