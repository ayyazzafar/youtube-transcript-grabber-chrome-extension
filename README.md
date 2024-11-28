# YouTube Transcript Grabber Chrome Extension

A Chrome extension that allows you to easily extract transcripts from YouTube videos directly from video thumbnails. This extension enhances your YouTube browsing experience by providing quick access to video transcripts without having to open the video.

## Features

- 🎯 Extract transcripts directly from YouTube video thumbnails
- 📋 One-click copy to clipboard functionality
- 🚀 Works on YouTube search results and recommended videos
- 💨 Fast and lightweight
- 🔒 Minimal permissions required
- 🌐 Works with any YouTube video that has captions available

## Installation

### Chrome Web Store

You can install the extension directly from the Chrome Web Store:
[YouTube Transcript Grabber](https://chromewebstore.google.com/detail/youtube-transcript-grabbe/mopkgmhafmbflidfgldgjnjodejfeagn)

### Manual Installation (Development)

1. Clone this repository
```bash
git clone [repository-url]
cd youtube-transcript-grabber-chrome-extension
```

2. Install dependencies
```bash
npm install
```

3. Build the extension
```bash
npm run build
```

4. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked" and select the `dist` directory from this project

## Development

This extension is built using:
- React
- TypeScript
- Vite

To start development:
```bash
npm run dev
```

## Permissions

The extension requires minimal permissions:
- `clipboardWrite`: To copy transcripts to clipboard
- `activeTab`: To interact with YouTube pages
- Access to `youtube.com` domain

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Store Link

Chrome Web Store: [YouTube Transcript Grabber](https://chromewebstore.google.com/detail/youtube-transcript-grabbe/mopkgmhafmbflidfgldgjnjodejfeagn)
