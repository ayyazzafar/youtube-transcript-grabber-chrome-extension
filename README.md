# YouTube Transcript Grabber

A Chrome extension that allows you to extract video transcripts directly from YouTube thumbnails without opening the videos.

## Features

- 📝 Extract transcripts with one click from video thumbnails
- 📋 Automatically copies transcript to clipboard
- ✨ Works on YouTube homepage, search results, and channel pages
- 🎯 Visual feedback for loading, success, and error states
- 🌐 Supports videos with English captions

## Installation

### From Source

1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/youtube-transcript-grabber.git
   ```
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension directory

## Usage

1. Visit YouTube (www.youtube.com)
2. Hover over any video thumbnail to see the transcript button (📝)
3. Click the button to copy the video's transcript to your clipboard
4. Visual feedback will indicate success (green) or failure (red)

## Limitations

- Only works with videos that have English captions available
- Does not work with auto-generated captions
- Requires video thumbnails to be visible on screen

## Files

- `manifest.json` - Extension configuration
- `content.js` - Main functionality for transcript extraction
- `styles.css` - Styling for the transcript button
- `icon48.png` & `icon128.png` - Extension icons

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to YouTube's caption system
- Inspired by the need for quick access to video transcripts
