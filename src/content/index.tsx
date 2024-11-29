import React from 'react';
import { TranscriptButton } from '@/components/TranscriptButton/TranscriptButton';
import { TranscriptSidebar } from '@/components/TranscriptSidebar/TranscriptSidebar';
import { createRoot } from 'react-dom/client';
import { TranscriptService } from '@/services/transcript';
import { TranscriptResponse } from '@/types/youtube';
import { VideoPlayerButton } from '@/components/VideoPlayerButton/VideoPlayerButton';
import { ShortsPlayerButton } from '@/components/ShortsPlayerButton/ShortsPlayerButton';
import '../styles/content.scss';

const SELECTORS = [
  { selector: 'a#thumbnail:not(.transcript-button-added)', type: 'thumbnail' },
  { selector: 'a#video-title:not(.transcript-button-added)', type: 'title' },
  { selector: '.ShortsLockupViewModelHostOutsideMetadataEndpoint:not(.transcript-button-added)', type: 'shorts' }
] as const;

// State for sidebar
let sidebarRoot: HTMLDivElement | null = null;
let sidebarIsOpen = false;
let currentTranscript: TranscriptResponse | null = null;
let lastKnownVideoId: string | null = null;

function extractVideoId(href: string): string | undefined {
  // First try to extract from standard watch URL
  const watchMatch = href.match(/[?&]v=([0-9A-Za-z_-]{11})/);
  if (watchMatch) return watchMatch[1];
  
  // Then try to extract from shortened URL
  const shortMatch = href.match(/youtu\.be\/([0-9A-Za-z_-]{11})/);
  if (shortMatch) return shortMatch[1];
  
  // Try to extract from embed URL
  const embedMatch = href.match(/embed\/([0-9A-Za-z_-]{11})/);
  if (embedMatch) return embedMatch[1];
  
  // Extract from Shorts URL
  const shortsMatch = href.match(/\/shorts\/([0-9A-Za-z_-]{11})/);
  if (shortsMatch) return shortsMatch[1];
  
  return undefined;
}

function getCurrentVideoId(): string | undefined {
  // For video pages, get from URL
  const urlVideoId = extractVideoId(window.location.href);
  if (urlVideoId) {
    // Update last known video ID if it's different
    if (lastKnownVideoId !== urlVideoId) {
      lastKnownVideoId = urlVideoId;
      // Reset transcript when video changes
      currentTranscript = null;
    }
    return urlVideoId;
  }

  // For embedded videos
  const videoElement = document.querySelector('video');
  if (videoElement) {
    const playerContainer = videoElement.closest('[data-video-id]');
    if (playerContainer) {
      const videoId = playerContainer.getAttribute('data-video-id');
      if (videoId) {
        // Update last known video ID if it's different
        if (lastKnownVideoId !== videoId) {
          lastKnownVideoId = videoId;
          // Reset transcript when video changes
          currentTranscript = null;
        }
        return videoId;
      }
    }
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
  
  // Check if this element's parent already has a transcript button
  const existingButton = thumbnail.closest('.ShortsLockupViewModelHost')?.querySelector('.transcript-button-container');
  if (existingButton) return;
  
  const videoId = extractVideoId(thumbnail.href);
  if (!videoId) return;

  const container = document.createElement('div');
  const selectorType = SELECTORS.find(s => thumbnail.matches(s.selector))?.type;
  container.className = `transcript-button-container transcript-button-${selectorType}`;
  
  // For Shorts, append to the metadata container
  if (selectorType === 'shorts') {
    const metadataContainer = thumbnail.closest('.ShortsLockupViewModelHostOutsideMetadata');
    if (metadataContainer) {
      metadataContainer.appendChild(container);
    } else {
      thumbnail.appendChild(container);
    }
  } else {
    thumbnail.appendChild(container);
  }

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

function injectShortsPlayerButton() {
  // Check if we're not on a Shorts page
  if (!window.location.pathname.includes('/shorts/')) return;

  // Remove any existing button first
  const existingButton = document.querySelector('.transcript-shorts-button');
  if (existingButton) return; // If button exists, don't add another one

  // Find the Shorts action buttons container
  const actionsContainer = document.querySelector('ytd-reel-player-overlay-renderer #actions');
  if (!actionsContainer) return;

  // Get video ID
  const videoId = getCurrentVideoId();
  if (!videoId) return;

  // Create container for our button
  const container = document.createElement('div');
  container.className = 'transcript-shorts-button';
  
  // Insert our button after the like/dislike buttons
  actionsContainer.appendChild(container);

  const root = createRoot(container);
  root.render(<ShortsPlayerButton videoId={videoId} />);
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

  let isProcessing = false;

  // Observe for thumbnail changes and Shorts player
  const observer = new MutationObserver(() => {
    if (isProcessing) return;
    isProcessing = true;

    // Use requestAnimationFrame to batch DOM updates
    requestAnimationFrame(() => {
      SELECTORS.forEach(selector => {
        document.querySelectorAll(selector.selector).forEach(injectTranscriptButton);
      });
      
      // Only inject player buttons if we're not already processing
      if (window.location.pathname.includes('/shorts/')) {
        injectShortsPlayerButton();
      } else {
        injectVideoPlayerButton();
      }

      isProcessing = false;
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Handle existing thumbnails and player
  SELECTORS.forEach(selector => {
    document.querySelectorAll(selector.selector).forEach(injectTranscriptButton);
  });

  // Initial injection based on current page type
  if (window.location.pathname.includes('/shorts/')) {
    injectShortsPlayerButton();
  } else {
    injectVideoPlayerButton();
  }

  // Handle YouTube SPA navigation
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      
      // Clean up existing buttons
      const existingShortButton = document.querySelector('.transcript-shorts-button');
      const existingPlayerButton = document.querySelector('.transcript-player-button');
      if (existingShortButton) existingShortButton.remove();
      if (existingPlayerButton) existingPlayerButton.remove();

      // Re-inject appropriate button
      if (window.location.pathname.includes('/shorts/')) {
        injectShortsPlayerButton();
      } else {
        injectVideoPlayerButton();
      }
    }
  }).observe(document.body, { subtree: true, childList: true });
}

init();