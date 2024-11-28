import React from 'react';
import { TranscriptButton } from '@/components/TranscriptButton/TranscriptButton';
import { TranscriptSidebar } from '@/components/TranscriptSidebar/TranscriptSidebar';
import { createRoot } from 'react-dom/client';
import { TranscriptService } from '@/services/transcript';
import { TranscriptResponse } from '@/types/youtube';
import { VideoPlayerButton } from '@/components/VideoPlayerButton/VideoPlayerButton';
import '../styles/content.scss';

const SELECTORS = [
  { selector: 'a#thumbnail:not(.transcript-button-added)', type: 'thumbnail' },
  { selector: 'a#video-title:not(.transcript-button-added)', type: 'title' }
] as const;

// State for sidebar
let sidebarRoot: HTMLDivElement | null = null;
let sidebarIsOpen = false;
let currentTranscript: TranscriptResponse | null = null;

function extractVideoId(href: string): string | undefined {
  const match = href.match(/(?:\/|%3D|v=)([0-9A-Za-z_-]{11})(?:[%#?&]|$)/);
  return match?.[1];
}

function getCurrentVideoId(): string | undefined {
  // Try to get video ID from URL first (for video pages)
  const urlMatch = window.location.href.match(/(?:\/|%3D|v=)([0-9A-Za-z_-]{11})(?:[%#?&]|$)/);
  if (urlMatch) return urlMatch[1];

  // Fallback to checking the video player (for embedded videos)
  const videoElement = document.querySelector('video');
  if (videoElement) {
    const playerContainer = videoElement.closest('[data-video-id]');
    const videoId = playerContainer?.getAttribute('data-video-id');
    return videoId || undefined;
  }

  return undefined;
}

async function handleSidebarToggle() {
  const videoId = getCurrentVideoId();
  if (!videoId) {
    console.error('No video ID found');
    return;
  }

  if (!sidebarRoot) {
    createSidebar();
  }

  if (!sidebarIsOpen) {
    // Fetch transcript if not already fetched
    if (!currentTranscript) {
      const transcriptService = TranscriptService.getInstance();
      const transcript = await transcriptService.getTranscript(videoId);
      currentTranscript = transcript;
    }
  }

  sidebarIsOpen = !sidebarIsOpen;
  renderSidebar();
}

function createSidebar() {
  if (!sidebarRoot) {
    sidebarRoot = document.createElement('div');
    sidebarRoot.id = 'transcript-sidebar-root';
    document.body.appendChild(sidebarRoot);
  }
}

function renderSidebar() {
  if (!sidebarRoot) return;

  const root = createRoot(sidebarRoot);
  root.render(
    <TranscriptSidebar
      isOpen={sidebarIsOpen}
      onClose={() => {
        sidebarIsOpen = false;
        renderSidebar();
      }}
      transcript={currentTranscript}
      onCopy={async () => {
        if (currentTranscript) {
          const transcriptService = TranscriptService.getInstance();
          await transcriptService.copyTranscriptToClipboard(currentTranscript);
        }
      }}
    />
  );
}

// Handle thumbnail buttons
function injectTranscriptButton(thumbnail: Element) {
  if (!(thumbnail instanceof HTMLAnchorElement)) return;
  
  const videoId = extractVideoId(thumbnail.href);
  if (!videoId) return;

  const container = document.createElement('div');
  const selectorType = SELECTORS.find(s => thumbnail.matches(s.selector))?.type;
  container.className = `transcript-button-container transcript-button-${selectorType}`;
  thumbnail.appendChild(container);

  thumbnail.classList.add('transcript-button-added');

  const root = createRoot(container);
  root.render(<TranscriptButton videoId={videoId} buttonType={selectorType} />);
}

function injectVideoPlayerButton() {
  const player = document.querySelector('#movie_player');
  if (!player || player.querySelector('.transcript-player-button')) return;

  const videoId = getCurrentVideoId();
  if (!videoId) return;

  const container = document.createElement('div');
  container.className = 'transcript-player-button';
  player.appendChild(container);

  const root = createRoot(container);
  root.render(<VideoPlayerButton videoId={videoId} />);
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'TOGGLE_SIDEBAR') {
    handleSidebarToggle();
  }
});

// Initialize
function init() {
  // Create sidebar container
  createSidebar();

  // Observe for thumbnail changes
  const observer = new MutationObserver(() => {
    SELECTORS.forEach(selector => {
      document.querySelectorAll(selector.selector).forEach(injectTranscriptButton);
    });
    injectVideoPlayerButton();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Handle existing thumbnails
  SELECTORS.forEach(selector => {
    document.querySelectorAll(selector.selector).forEach(injectTranscriptButton);
  });
  injectVideoPlayerButton();
}

init(); 