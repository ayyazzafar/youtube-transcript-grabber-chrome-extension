export interface TranscriptSegment {
  text: string;
  start: number;
  duration: number;
}

export interface TranscriptResponse {
  segments: TranscriptSegment[];
  success: boolean;
  error?: string;
  language?: string;
}

export interface VideoMetadata {
  videoId: string;
  title?: string;
}

export interface EngagementPanel {
  engagementPanelSectionListRenderer?: {
    panelIdentifier: string;
    content?: {
      transcriptRenderer?: {
        content?: {
          transcriptSearchPanelRenderer?: {
            body?: {
              transcriptSegmentListRenderer?: {
                initialSegments: Array<{
                  baseUrl?: string;
                  url?: string;
                }>;
              };
            };
          };
        };
      };
    };
  };
}

export interface YouTubeInitialData {
  engagementPanels?: EngagementPanel[];
  captions?: {
    playerCaptionsTracklistRenderer?: {
      captionTracks: Array<{
        baseUrl: string;
        url?: string;
      }>;
    };
  };
}