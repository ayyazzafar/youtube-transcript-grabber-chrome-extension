import { useState } from 'react';
import { TranscriptService } from '@/services/transcript';

export const useTranscript = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const grabTranscript = async (videoId: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const transcriptService = TranscriptService.getInstance();
      const transcript = await transcriptService.getTranscript(videoId);

      if (!transcript.success) {
        setError(transcript.error || 'Failed to fetch transcript');
        return;
      }

      const copied = await transcriptService.copyTranscriptToClipboard(transcript);
      if (copied) {
        setSuccess(true);
      } else {
        setError('Failed to copy transcript to clipboard');
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
      // Reset success message after 3 seconds
      if (success) {
        setTimeout(() => setSuccess(false), 3000);
      }
    }
  };

  return {
    grabTranscript,
    loading,
    error,
    success
  };
}; 