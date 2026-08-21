/**
 * Storage Module - localStorage management
 * Handles state persistence, data validation, and export
 */

const STORAGE_KEY = 'luna-bloom-cycle-tracker';

const defaultState = {
  settings: {
    cycleLength: 28,
    periodLength: 5,
    darkMode: false,
    reminders: false
  },
  periods: [],
  symptoms: {}
};

/**
 * Load state from localStorage with fallback to defaults
 * @returns {Object} The current state
 */
function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved) {
      return structuredClone(defaultState);
    }
    return {
      settings: { ...defaultState.settings, ...saved.settings },
      periods: Array.isArray(saved.periods) ? saved.periods : [],
      symptoms: saved.symptoms && typeof saved.symptoms === 'object' ? saved.symptoms : {}
    };
  } catch (error) {
    console.warn('Failed to load state from localStorage:', error);
    return structuredClone(defaultState);
  }
}

/**
 * Save state to localStorage
 * @param {Object} state - The state to save
 */
function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save state to localStorage:', error);
    if (error.name === 'QuotaExceededError') {
      alert('Storage quota exceeded. Please clear some data or cache.');
    }
  }
}

/**
 * Clear all data from localStorage
 */
function clearAllData() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear data:', error);
  }
}

/**
 * Validate settings before saving
 * @param {number} cycleLength - Proposed cycle length
 * @param {number} periodLength - Proposed period length
 * @returns {Object} { isValid, message }
 */
function validateSettings(cycleLength, periodLength) {
  const cycle = Number(cycleLength);
  const period = Number(periodLength);

  if (Number.isNaN(cycle) || Number.isNaN(period)) {
    return { isValid: false, message: 'Please enter valid numbers.' };
  }

  if (cycle < 20 || cycle > 45) {
    return { isValid: false, message: 'Cycle length must be between 20–45 days.' };
  }

  if (period < 2 || period > 10) {
    return { isValid: false, message: 'Period length must be between 2–10 days.' };
  }

  if (period >= cycle) {
    return { isValid: false, message: 'Period length must be shorter than cycle length.' };
  }

  return { isValid: true, message: 'Settings saved.' };
}

/**
 * Export data as CSV
 * @param {Object} state - Application state
 * @returns {string} CSV content
 */
function exportDataAsCSV(state) {
  const rows = [];
  
  // Header
  rows.push('Date,Type,Details');
  
  // Period starts
  state.periods.forEach(date => {
    rows.push(`${date},Period Start,First day of cycle`);
  });
  
  // Symptoms
  Object.entries(state.symptoms).forEach(([date, symptoms]) => {
    rows.push(`${date},Symptoms,"${symptoms.join(', ')}"`);
  });
  
  return rows.join('\n');
}

/**
 * Export data as JSON
 * @param {Object} state - Application state
 * @returns {string} JSON content
 */
function exportDataAsJSON(state) {
  return JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      settings: state.settings,
      periods: state.periods,
      symptoms: state.symptoms
    },
    null,
    2
  );
}

/**
 * Download data as a file
 * @param {string} content - File content
 * @param {string} filename - Filename
 * @param {string} mimeType - MIME type
 */
function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export data to CSV file
 * @param {Object} state - Application state
 */
function exportToCSV(state) {
  const content = exportDataAsCSV(state);
  const filename = `lucent-cycle-${formatDateKey(new Date())}.csv`;
  downloadFile(content, filename, 'text/csv');
}

/**
 * Export data to JSON file
 * @param {Object} state - Application state
 */
function exportToJSON(state) {
  const content = exportDataAsJSON(state);
  const filename = `lucent-cycle-${formatDateKey(new Date())}.json`;
  downloadFile(content, filename, 'application/json');
}

/**
 * Import data from JSON file
 * @param {File} file - JSON file to import
 * @returns {Promise} Resolves with imported state or rejects with error
 */
function importFromJSON(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        
        // Validate structure
        if (!data.settings || !Array.isArray(data.periods) || !data.symptoms) {
          reject(new Error('Invalid file format'));
          return;
        }
        
        resolve(data);
      } catch (error) {
        reject(new Error('Failed to parse JSON file'));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
