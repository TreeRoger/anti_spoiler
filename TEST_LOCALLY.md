# Testing the Extension Locally

## Quick Test Instructions

### For Chrome/Edge:

1. **Open Chrome/Edge** and navigate to:
   ```
   chrome://extensions/
   ```
   (For Edge, use: `edge://extensions/`)

2. **Enable Developer Mode**:
   - Toggle the switch in the top-right corner

3. **Load the Extension**:
   - Click "Load unpacked" button
   - Navigate to: `/Users/rogerjin/anti_spoiler`
   - Click "Select" or "Open"

4. **Verify Installation**:
   - You should see "Anti-Spoiler Blocker" in your extensions list
   - The extension icon should appear in your toolbar

5. **Test It**:
   - Click the extension icon
   - Add a test show (e.g., "Game of Thrones")
   - Visit a test page with spoiler content

### For Firefox:

1. **Open Firefox** and navigate to:
   ```
   about:debugging
   ```

2. **Click "This Firefox"** tab

3. **Load Temporary Add-on**:
   - Click "Load Temporary Add-on..."
   - Navigate to `/Users/rogerjin/anti_spoiler`
   - Select `manifest.json`
   - Click "Open"

4. **Verify Installation**:
   - The extension should appear in the list
   - Icon should appear in toolbar

## Testing Steps

1. **Add a Show**:
   - Click extension icon → Add "Breaking Bad"

2. **Test Detection**:
   - Visit: `https://www.reddit.com/r/breakingbad` (or any page mentioning the show)
   - You should see a warning overlay

3. **Check Settings**:
   - Right-click extension icon → Options
   - Adjust sensitivity and blocking mode

## Troubleshooting

- **Extension not loading?** Check browser console for errors
- **No warnings?** Make sure extension is enabled (toggle in popup)
- **Icons missing?** Icons are already generated in `icons/` folder

## Current Extension Path

```
/Users/rogerjin/anti_spoiler
```

