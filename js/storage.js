/**
 * Storage Module - localStorage management
 * Handles state persistence and data validation
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