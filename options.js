// Options page script
// Handles advanced settings and show management

document.addEventListener('DOMContentLoaded', () => {
  // Get all DOM elements
  const blockingModeRadios = document.querySelectorAll('input[name="blocking-mode"]');
  const sensitivitySlider = document.getElementById('sensitivity');
  const sensitivityValue = document.getElementById('sensitivity-value');
  const showsList = document.getElementById('shows-list');
  const showSelector = document.getElementById('show-selector');
  const keywordsEditor = document.getElementById('keywords-editor');
  const keywordsInput = document.getElementById('keywords-input');
  const saveKeywordsBtn = document.getElementById('save-keywords');
  const exportBtn = document.getElementById('export-btn');
  const importBtn = document.getElementById('import-btn');
  const importFile = document.getElementById('import-file');
  const resetBtn = document.getElementById('reset-btn');
  
  // Initialize settings page
  loadSettings();
  
  // Handle blocking mode radio button changes
  blockingModeRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      chrome.storage.local.set({ blockingMode: e.target.value });
    });
  });
  
  // Handle sensitivity slider changes
  sensitivitySlider.addEventListener('input', (e) => {
    const value = parseInt(e.target.value);
    const labels = ['Low sensitivity', 'Medium sensitivity', 'High sensitivity'];
    sensitivityValue.textContent = labels[value - 1];
    chrome.storage.local.set({ sensitivity: value });
  });
  
  // Handle show selector dropdown
  showSelector.addEventListener('change', (e) => {
    const showName = e.target.value;
    if (showName) {
      loadShowKeywords(showName);
      keywordsEditor.style.display = 'block';
    } else {
      keywordsEditor.style.display = 'none';
    }
  });
  
  // Save custom keywords for selected show
  saveKeywordsBtn.addEventListener('click', () => {
    const showName = showSelector.value;
    if (!showName) return;
    
    // Parse comma-separated keywords
    const keywords = keywordsInput.value
      .split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0);
    
    chrome.storage.local.get(['watchedShows'], (data) => {
      const shows = data.watchedShows || [];
      const showIndex = shows.findIndex(s => s.name === showName);
      
      // Update keywords for the selected show
      if (showIndex !== -1) {
        shows[showIndex].keywords = keywords;
        chrome.storage.local.set({ watchedShows: shows }, () => {
          alert('Keywords saved!');
          loadShows();
        });
      }
    });
  });
  
  // Export all settings to JSON file
  exportBtn.addEventListener('click', () => {
    chrome.storage.local.get(null, (data) => {
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'anti-spoiler-settings.json';
      a.click();
      URL.revokeObjectURL(url);
    });
  });
  
  // Import settings from JSON file
  importBtn.addEventListener('click', () => {
    importFile.click();
  });
  
  importFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        chrome.storage.local.set(data, () => {
          alert('Settings imported successfully!');
          loadSettings();
        });
      } catch (error) {
        alert('Error importing settings: Invalid JSON file');
      }
    };
    reader.readAsText(file);
  });
  
  // Reset all settings to defaults
  resetBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all settings? This cannot be undone.')) {
      chrome.storage.local.clear(() => {
        chrome.storage.local.set({
          enabled: true,
          watchedShows: [],
          blockingMode: 'warning',
          sensitivity: 2
        }, () => {
          alert('Settings reset!');
          loadSettings();
        });
      });
    }
  });
  
  // Load and display all settings
  function loadSettings() {
    chrome.storage.local.get(['blockingMode', 'sensitivity', 'watchedShows'], (data) => {
      // Set blocking mode radio button
      const mode = data.blockingMode || 'warning';
      document.querySelector(`input[name="blocking-mode"][value="${mode}"]`).checked = true;
      
      // Set sensitivity slider
      const sensitivity = data.sensitivity || 2;
      sensitivitySlider.value = sensitivity;
      const labels = ['Low sensitivity', 'Medium sensitivity', 'High sensitivity'];
      sensitivityValue.textContent = labels[sensitivity - 1];
      
      // Load shows list
      loadShows();
    });
  }
  
  // Load and display watched shows
  function loadShows() {
    chrome.storage.local.get(['watchedShows'], (data) => {
      const shows = data.watchedShows || [];
      
      // Render shows list
      if (shows.length === 0) {
        showsList.innerHTML = '<p style="color: #999;">No shows added yet.</p>';
      } else {
        showsList.innerHTML = shows.map((show, index) => `
          <div class="show-item">
            <span>${escapeHtml(show.name)}</span>
            <button class="delete-btn" data-index="${index}">Delete</button>
          </div>
        `).join('');
        
        // Attach delete handlers
        showsList.querySelectorAll('.delete-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const index = parseInt(btn.dataset.index);
            removeShow(index);
          });
        });
      }
      
      // Update show selector dropdown
      showSelector.innerHTML = '<option value="">Select a show...</option>' +
        shows.map(show => `<option value="${escapeHtml(show.name)}">${escapeHtml(show.name)}</option>`).join('');
    });
  }
  
  // Load keywords for selected show into editor
  function loadShowKeywords(showName) {
    chrome.storage.local.get(['watchedShows'], (data) => {
      const shows = data.watchedShows || [];
      const show = shows.find(s => s.name === showName);
      
      if (show) {
        keywordsInput.value = (show.keywords || []).join(', ');
      }
    });
  }
  
  // Remove a show from the watched list
  function removeShow(index) {
    if (confirm('Are you sure you want to remove this show?')) {
      chrome.storage.local.get(['watchedShows'], (data) => {
        const shows = data.watchedShows || [];
        shows.splice(index, 1);
        chrome.storage.local.set({ watchedShows: shows }, () => {
          loadShows();
          // Clear editor if deleted show was selected
          if (showSelector.value) {
            showSelector.value = '';
            keywordsEditor.style.display = 'none';
          }
        });
      });
    }
  }
  
  // Escape HTML to prevent XSS attacks
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
});

