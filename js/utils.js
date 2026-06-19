/**
 * Utils Module - Helper functions for date manipulation and formatting
 */

/**
 * Add days to a date
 * @param {Date} date - The starting date
 * @param {number} amount - Number of days to add
 * @returns {Date} New date at start of day
 */
function addDays(date, amount) {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return startOfDay(result);
}

/**
 * Calculate difference in days between two dates
 * @param {Date} laterDate - The later date
 * @param {Date} earlierDate - The earlier date
 * @returns {number} Number of days between
 */
function diffInDays(laterDate, earlierDate) {
  return Math.round((startOfDay(laterDate) - startOfDay(earlierDate)) / 86400000);
}

/**
 * Get start of day for a given date
 * @param {Date} date - The date
 * @returns {Date} Date at midnight
 */
function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * Check if two dates are the same day
 * @param {Date} a - First date
 * @param {Date} b - Second date
 * @returns {boolean} True if same day
 */
function isSameDay(a, b) {
  return formatDateKey(a) === formatDateKey(b);
}

/**
 * Format date as YYYY-MM-DD
 * @param {Date} date - The date to format
 * @returns {string} Date key string
 */
function formatDateKey(date) {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

/**
 * Format date as long string (e.g., "Mon, Jun 19, 2024")
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string
 */
function formatLongDate(date) {
  return startOfDay(date).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Format date as short string (e.g., "Jun 19")
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string
 */
function formatShortDate(date) {
  return startOfDay(date).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Find most common value in an array
 * @param {Array} values - Array of values
 * @returns {string} Most common value or empty string
 */
function findMostCommon(values) {
  if (values.length === 0) {
    return '';
  }

  const counts = values.reduce((map, value) => {
    map[value] = (map[value] || 0) + 1;
    return map;
  }, {});

  return capitalize(
    Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]
  );
}

/**
 * Capitalize first letter of a string
 * @param {string} value - String to capitalize
 * @returns {string} Capitalized string
 */
function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/**
 * Clamp a number between min and max
 * @param {number} value - The value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @param {number} fallback - Fallback if NaN
 * @returns {number} Clamped value
 */
function clampNumber(value, min, max, fallback) {
  if (Number.isNaN(value)) {
    return fallback;
  }
  return Math.min(Math.max(value, min), max);
}