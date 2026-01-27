// Background service worker for Anti-Spoiler Blocker
// Handles URL monitoring and blocking logic

// Monitor navigation events to intercept potentially spoiler-containing URLs
chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
  // Only process main frame navigation, ignore iframes
  if (details.frameId !== 0) return;
  
  // Check if the URL contains spoiler content
  const result = await checkForSpoilers(details.url, details.tabId);
  if (result.hasSpoiler) {
    // Redirect to blocked page if spoiler detected
    chrome.tabs.update(details.tabId, {
      url: chrome.runtime.getURL(`blocked.html?url=${encodeURIComponent(details.url)}&show=${encodeURIComponent(result.showName)}`)
    });
  }
});

// Check if a URL contains spoilers based on watched shows
async function checkForSpoilers(url, tabId) {
  // Retrieve user settings from local storage
  const data = await chrome.storage.local.get(['watchedShows', 'enabled']);
  
  // Return early if extension is disabled
  if (!data.enabled) {
    return { hasSpoiler: false };
  }
  
  // Return early if no shows are being watched
  const watchedShows = data.watchedShows || [];
  if (watchedShows.length === 0) {
    return { hasSpoiler: false };
  }
  
  // Normalize URL for case-insensitive matching
  const urlLower = url.toLowerCase();
  
  // Check each watched show against the URL
  for (const show of watchedShows) {
    const showNameLower = show.name.toLowerCase();
    const showKeywords = show.keywords || [];
    
    // Match if URL contains show name or any associated keywords
    if (urlLower.includes(showNameLower) || 
        showKeywords.some(keyword => urlLower.includes(keyword.toLowerCase()))) {
      return { hasSpoiler: true, showName: show.name };
    }
  }
  
  return { hasSpoiler: false };
}

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Check spoilers on demand (called from content script)
  if (request.action === 'checkSpoilers') {
    checkForSpoilers(request.url, sender.tab.id).then(result => {
      sendResponse(result);
    });
    return true; // Keep message channel open for async response
  }
  
  // Block page on demand (called from content script)
  if (request.action === 'blockPage') {
    chrome.tabs.update(sender.tab.id, {
      url: chrome.runtime.getURL(`blocked.html?url=${encodeURIComponent(request.url)}&show=${encodeURIComponent(request.showName)}`)
    });
  }
});

// Initialize default settings when extension is first installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['enabled', 'watchedShows'], (data) => {
    // Set default enabled state to true
    if (data.enabled === undefined) {
      chrome.storage.local.set({ enabled: true });
    }
    // Initialize empty shows array if it doesn't exist
    if (!data.watchedShows) {
      chrome.storage.local.set({ watchedShows: [] });
    }
  });
});

