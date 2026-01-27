# 🛡️ Anti-Spoiler Blocker

A browser extension that blocks websites, pages, and posts that may contain spoilers for shows you're currently watching.

## Features

- ✅ **Smart Detection**: Automatically detects spoiler content based on show names and keywords
- ✅ **Warning Overlay**: Shows a warning overlay when potential spoilers are detected
- ✅ **Custom Keywords**: Add custom keywords for each show to improve detection
- ✅ **Easy Management**: Simple popup interface to add/remove shows
- ✅ **Advanced Settings**: Fine-tune blocking behavior and sensitivity
- ✅ **Export/Import**: Backup and restore your settings

## Installation

### For Chrome/Edge:

1. Clone or download this repository
2. Open Chrome/Edge and navigate to `chrome://extensions/` (or `edge://extensions/`)
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select the `anti_spoiler` folder
6. The extension icon should appear in your toolbar

### For Firefox:

1. Clone or download this repository
2. Open Firefox and navigate to `about:debugging`
3. Click "This Firefox"
4. Click "Load Temporary Add-on"
5. Select the `manifest.json` file from the `anti_spoiler` folder

## Usage

1. **Add Shows**: Click the extension icon and add shows you're currently watching
2. **Automatic Protection**: The extension will automatically detect and warn about potential spoilers
3. **Customize Keywords**: Go to Advanced Settings to add custom keywords for better detection
4. **Adjust Sensitivity**: Change detection sensitivity in settings (Low/Medium/High)

## How It Works

The extension uses multiple detection methods:

1. **URL Detection**: Checks if the URL contains show names or keywords
2. **Page Content Analysis**: Scans page text for show names and spoiler indicators
3. **Keyword Matching**: Uses custom keywords you've added for each show
4. **Spoiler Indicators**: Looks for words like "spoiler", "ending", "death", "finale", etc.

## Configuration

### Blocking Modes:
- **Warning Overlay**: Shows a warning but allows you to continue
- **Complete Block**: Redirects to a blocked page

### Sensitivity Levels:
- **Low**: Only blocks obvious spoiler content
- **Medium**: Balanced detection (default)
- **High**: More aggressive blocking

## File Structure

```
anti_spoiler/
├── manifest.json          # Extension manifest
├── background.js          # Service worker for blocking logic
├── content.js            # Content script for page analysis
├── popup.html            # Extension popup UI
├── popup.css             # Popup styles
├── popup.js              # Popup logic
├── options.html          # Settings page
├── options.css           # Settings styles
├── options.js            # Settings logic
├── blocked.html          # Blocked page template
├── icons/                # Extension icons
└── README.md             # This file
```

## Adding Icons

You'll need to add icon files to the `icons/` directory:
- `icon16.png` (16x16 pixels)
- `icon48.png` (48x48 pixels)
- `icon128.png` (128x128 pixels)

You can create simple icons or use an icon generator. The extension will work without icons, but they improve the user experience.

## Privacy

- All data is stored locally in your browser
- No data is sent to external servers
- No tracking or analytics
- Your watched shows list stays private

## Limitations

- Detection is based on keyword matching, so it may have false positives/negatives
- Some dynamic content may not be detected immediately
- Works best with English content (can be extended for other languages)

## Future Enhancements

Potential improvements:
- Integration with TV tracking services (Trakt, TVTime)
- Machine learning for better spoiler detection
- Support for movies and books
- Whitelist specific domains
- Per-show blocking rules

## Contributing

Feel free to submit issues or pull requests!

## License

MIT License - feel free to use and modify as needed.

