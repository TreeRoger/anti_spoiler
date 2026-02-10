// Content script to detect spoilers on the current page
// Runs on every page load to analyze content and show warnings

(async function() {
  'use strict';
  
  // Load user settings from storage
  const data = await chrome.storage.local.get(['watchedShows', 'enabled']);
  
  // Exit early if extension is disabled
  if (!data.enabled) {
    return;
  }
  
  // Exit early if no shows are being watched
  const watchedShows = data.watchedShows || [];
  if (watchedShows.length === 0) {
    return;
  }
  
  // Wait for page to fully load before analyzing content
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkPage);
  } else {
    checkPage();
  }
  
  // Analyze page content for potential spoilers
  function checkPage() {
    // Extract text content from page for analysis
    const pageText = document.body.innerText.toLowerCase();
    const pageTitle = document.title.toLowerCase();
    const url = window.location.href.toLowerCase();
    
    // Check each watched show against page content
    for (const show of watchedShows) {
      const showNameLower = show.name.toLowerCase();
      const showKeywords = (show.keywords || []).map(k => k.toLowerCase());
      
      // Check if page mentions the show name in text, title, or URL
      const hasShowName = pageText.includes(showNameLower) || 
                         pageTitle.includes(showNameLower) ||
                         url.includes(showNameLower);
      
      // Check if page contains any show-specific keywords
      const hasKeywords = showKeywords.some(keyword => 
        pageText.includes(keyword) || 
        pageTitle.includes(keyword) ||
        url.includes(keyword)
      );
      
      // If show is mentioned, check for spoiler indicators
      if (hasShowName || hasKeywords) {
        // List of words that typically indicate spoiler content
        const spoilerIndicators = [
          'spoiler', 'spoilers', 'ending', 'finale', 'death', 'dies',
          'killed', 'reveal', 'twist', 'plot', 'episode', 'season',
          'review', 'recap', 'explained', 'theory', 'leak'
        ];
        
        // Check if page contains spoiler indicator words
        const hasSpoilerContent = spoilerIndicators.some(indicator => 
          pageText.includes(indicator) || pageTitle.includes(indicator)
        );
        
        // Show warning if spoiler content detected or show name found
        if (hasSpoilerContent || hasShowName) {
          showWarningOverlay(show.name);
          break; // Only show one warning per page
        }
      }
    }
  }
  
  // Display warning overlay when spoiler content is detected
  function showWarningOverlay(showName) {
    // Remove any existing overlay to prevent duplicates
    const existing = document.getElementById('anti-spoiler-overlay');
    if (existing) {
      existing.remove();
    }
    
    // Create overlay element with warning message
    const overlay = document.createElement('div');
    overlay.id = 'anti-spoiler-overlay';
    overlay.innerHTML = `
      <div class="anti-spoiler-warning">
        <div class="anti-spoiler-content">
          <h2>⚠️ Potential Spoiler Warning</h2>
          <p>This page may contain spoilers for: <strong>${showName}</strong></p>
          <div class="anti-spoiler-buttons">
            <button id="anti-spoiler-leave" class="anti-spoiler-btn anti-spoiler-btn-primary">Leave Page</button>
            <button id="anti-spoiler-continue" class="anti-spoiler-btn anti-spoiler-btn-secondary">Continue Anyway</button>
          </div>
        </div>
      </div>
    `;
    
    // Inject CSS styles for the overlay (backdrop blur, enter animation, softer colors)
    const style = document.createElement('style');
    style.textContent = `
      @keyframes anti-spoiler-fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes anti-spoiler-scaleIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
      }
      #anti-spoiler-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        z-index: 999999;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        animation: anti-spoiler-fadeIn 0.25s ease-out;
      }
      .anti-spoiler-warning {
        background: #1e1e1e;
        border: 2px solid #d35400;
        border-radius: 12px;
        padding: 2rem;
        max-width: 500px;
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
        animation: anti-spoiler-scaleIn 0.3s ease-out;
      }
      .anti-spoiler-content h2 {
        color: #e67e22;
        margin: 0 0 1rem 0;
        font-size: 1.5rem;
      }
      .anti-spoiler-content p {
        color: #e0e0e0;
        margin: 0 0 1.5rem 0;
        font-size: 1rem;
        line-height: 1.5;
      }
      .anti-spoiler-content strong {
        color: #f1c40f;
      }
      .anti-spoiler-buttons {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
      }
      .anti-spoiler-btn {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.2s;
      }
      .anti-spoiler-btn-primary {
        background: #d35400;
        color: white;
      }
      .anti-spoiler-btn-primary:hover {
        background: #c0392b;
        transform: translateY(-1px);
      }
      .anti-spoiler-btn-secondary {
        background: #4a4a4a;
        color: #e0e0e0;
      }
      .anti-spoiler-btn-secondary:hover {
        background: #5a5a5a;
      }
    `;
    
    // Append styles and overlay to page
    document.head.appendChild(style);
    document.body.appendChild(overlay);
    
    // Handle "Leave Page" button - navigate back
    document.getElementById('anti-spoiler-leave').addEventListener('click', () => {
      window.history.back();
      overlay.remove();
    });
    
    // Handle "Continue Anyway" button - dismiss overlay
    document.getElementById('anti-spoiler-continue').addEventListener('click', () => {
      overlay.remove();
    });
  }
})();

