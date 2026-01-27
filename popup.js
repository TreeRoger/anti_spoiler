// Popup script for managing watched shows
// Handles UI interactions in the extension popup

document.addEventListener('DOMContentLoaded', () => {
  // Get DOM elements
  const enabledToggle = document.getElementById('enabled-toggle');
  const showsList = document.getElementById('shows-list');
  const addShowForm = document.getElementById('add-show-form');
  const showNameInput = document.getElementById('show-name-input');
  
  // Load and display current settings
  loadSettings();
  
  // Handle enable/disable toggle
  enabledToggle.addEventListener('change', (e) => {
    chrome.storage.local.set({ enabled: e.target.checked });
  });
  
  // Handle form submission to add new show
  addShowForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const showName = showNameInput.value.trim();
    if (showName) {
      addShow(showName);
      showNameInput.value = ''; // Clear input after adding
    }
  });
  
  // Load settings from storage and update UI
  function loadSettings() {
    chrome.storage.local.get(['enabled', 'watchedShows'], (data) => {
      enabledToggle.checked = data.enabled !== false;
      displayShows(data.watchedShows || []);
    });
  }
  
  // Render the list of watched shows
  function displayShows(shows) {
    if (shows.length === 0) {
      showsList.innerHTML = '<div class="empty-state">No shows added yet. Add a show to start blocking spoilers!</div>';
      return;
    }
    
    // Generate HTML for each show with delete button
    showsList.innerHTML = shows.map((show, index) => `
      <div class="show-item">
        <span>${escapeHtml(show.name)}</span>
        <button class="delete-btn" data-index="${index}">Remove</button>
      </div>
    `).join('');
    
    // Attach click handlers to delete buttons
    showsList.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.dataset.index);
        removeShow(index);
      });
    });
  }
  
  // Add a new show to the watched list
  function addShow(showName) {
    chrome.storage.local.get(['watchedShows'], (data) => {
      const shows = data.watchedShows || [];
      
      // Prevent duplicate entries (case-insensitive)
      if (shows.some(s => s.name.toLowerCase() === showName.toLowerCase())) {
        alert('This show is already in your list!');
        return;
      }
      
      // Auto-generate keywords from show name for better detection
      const keywords = generateKeywords(showName);
      
      // Add show with metadata
      shows.push({
        name: showName,
        keywords: keywords,
        addedAt: Date.now()
      });
      
      // Save and refresh display
      chrome.storage.local.set({ watchedShows: shows }, () => {
        displayShows(shows);
      });
    });
  }
  
  // Remove a show from the watched list
  function removeShow(index) {
    chrome.storage.local.get(['watchedShows'], (data) => {
      const shows = data.watchedShows || [];
      shows.splice(index, 1);
      chrome.storage.local.set({ watchedShows: shows }, () => {
        displayShows(shows);
      });
    });
  }
  
  // Generate keywords from show name for better spoiler detection
  function generateKeywords(showName) {
    // Split show name into words
    const words = showName.toLowerCase().split(/\s+/);
    const keywords = [];
    
    // Add individual words (useful for acronyms or partial matches)
    words.forEach(word => {
      if (word.length > 2) {
        keywords.push(word);
      }
    });
    
    // Add common variations (no spaces, hyphenated)
    if (words.length > 1) {
      keywords.push(words.join(''));
      keywords.push(words.join('-'));
    }
    
    // Return unique keywords only
    return [...new Set(keywords)];
  }
  
  // Escape HTML to prevent XSS attacks
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
});

