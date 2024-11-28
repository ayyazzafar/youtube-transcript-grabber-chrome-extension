import { TranscriptResponse } from '@/types/youtube';

export class TranscriptService {
  private static instance: TranscriptService;
  
  private constructor() {}
  
  public static getInstance(): TranscriptService {
    if (!TranscriptService.instance) {
      TranscriptService.instance = new TranscriptService();
    }
    return TranscriptService.instance;
  }

  public async getTranscript(videoId: string): Promise<TranscriptResponse> {
    try {
      const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`);
      const html = await response.text();

      // Extract captions data from YouTube's initial data
      const captionsMatch = html.match(/"captionTracks":\[(.*?)\]/);
      if (!captionsMatch) {
        return {
          segments: [],
          success: false,
          error: 'No captions found'
        };
      }

      const captionsData = JSON.parse(`[${captionsMatch[1]}]`);
      const englishCaptions = captionsData.find(
        (caption: { languageCode: string }) => caption.languageCode === "en"
      );

      if (!englishCaptions) {
        return {
          segments: [],
          success: false,
          error: 'No English captions found'
        };
      }

      // Get transcript from the baseUrl
      const transcriptResponse = await fetch(englishCaptions.baseUrl);
      const transcriptXml = await transcriptResponse.text();

      // Parse XML and extract text
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(transcriptXml, "text/xml");
      const textElements = xmlDoc.getElementsByTagName("text");

      const segments = Array.from(textElements).map((element: Element) => ({
        text: element.textContent?.trim() || '',
        start: parseFloat(element.getAttribute('start') || '0'),
        duration: parseFloat(element.getAttribute('dur') || '0')
      }));

      return {
        segments,
        success: true
      };
    } catch (error) {
      console.error('Transcript fetch error:', error);
      return {
        segments: [],
        success: false,
        error: 'Failed to fetch transcript'
      };
    }
  }

  public async copyTranscriptToClipboard(transcript: TranscriptResponse): Promise<boolean> {
    if (!transcript.success || transcript.segments.length === 0) {
      return false;
    }

    const text = transcript.segments
      .map(segment => segment.text)
      .join(' ');

    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }
}