/**
 * Predictions Module - Cycle calculations and phase detection
 * Handles ovulation, fertile window, and cycle phase logic
 */

const reliefByPhase = {
  menstrual: {
    exercise: 'Lean into gentle stretches, short walks, pelvic-opening yoga, and extra rest if cramps feel heavy.',
    diet: 'Focus on iron-rich foods like spinach, lentils, beans, and warm soups. Keep water nearby and add magnesium-rich snacks if helpful.'
  },
  follicular: {
    exercise: 'Energy may start rising here, so light strength training, brisk walks, dance, or beginner cardio can feel supportive.',
    diet: 'Aim for balanced meals with protein, colorful vegetables, whole grains, and steady hydration.'
  },
  ovulation: {
    exercise: 'This phase often suits light workouts, cycling, Pilates, or a slightly more active routine if your energy feels good.',
    diet: 'Add fiber, leafy greens, berries, and plenty of water to support digestion and recovery.'
  },
  luteal: {
    exercise: 'Try lower-impact movement like stretching, restorative yoga, walking, or shorter strength sessions with more recovery time.',
    diet: 'Prioritize hydration and foods rich in calcium, complex carbs, and vitamin B6 such as oats, yogurt, bananas, chickpeas, and seeds.'
  }
};

/**
 * Get predictions for next period, ovulation, and fertile window
 * @param {Object} state - The application state
 * @returns {Object} Predictions object
 */
function getPredictions(state) {
  const starts = getSortedPeriodStarts(state);
  const latestStart = starts.at(-1);

  if (!latestStart) {
    return {
      nextPeriodStart: null,
      fertileStart: null,
      fertileEnd: null,
      ovulationDate: null
    };
  }

  const cycleLength = state.settings.cycleLength;
  const nextPeriodStart = addDays(latestStart, cycleLength);
  const ovulationDate = addDays(nextPeriodStart, -14);
  const fertileStart = addDays(ovulationDate, -5);
  const fertileEnd = addDays(ovulationDate, 1);

  return { nextPeriodStart, ovulationDate, fertileStart, fertileEnd };
}

/**
 * Get current cycle phase for a given date
 * @param {Date} date - The date to check
 * @param {Object} state - The application state
 * @returns {Object} Phase object with phase name
 */
function getCyclePhase(date, state) {
  const info = getCurrentCycleDay(date, state);
  const dayNumber = info.dayNumber;

  if (!dayNumber) {
    return { phase: 'follicular' };
  }

  if (dayNumber <= state.settings.periodLength) {
    return { phase: 'menstrual' };
  }

  const ovulationDay = state.settings.cycleLength - 14;
  if (dayNumber >= ovulationDay - 4 && dayNumber <= ovulationDay + 1) {
    return { phase: dayNumber === ovulationDay ? 'ovulation' : 'follicular' };
  }

  if (dayNumber > ovulationDay + 1) {
    return { phase: 'luteal' };
  }

  return { phase: 'follicular' };
}

/**
 * Get current day number in cycle
 * @param {Date} date - The date to check
 * @param {Object} state - The application state
 * @returns {Object} Object with dayNumber and cycleStart
 */
function getCurrentCycleDay(date, state) {
  const starts = getSortedPeriodStarts(state);
  if (starts.length === 0) {
    return { dayNumber: null, cycleStart: null };
  }

  const target = startOfDay(date);
  const candidates = starts.filter((start) => start <= target);
  if (candidates.length === 0) {
    return { dayNumber: null, cycleStart: null };
  }

  const cycleStart = candidates.at(-1);
  return {
    dayNumber: diffInDays(target, cycleStart) + 1,
    cycleStart
  };
}

/**
 * Get date flags for calendar visualization
 * @param {Date} date - The date to check
 * @param {Object} state - The application state
 * @param {Object} predictions - Predictions object
 * @returns {Object} Flags for period, fertile, ovulation, predicted
 */
function getDateFlags(date, state, predictions) {
  const day = startOfDay(date);
  const starts = getSortedPeriodStarts(state);
  const dayKey = formatDateKey(day);
  const selectedStart = state.periods.includes(dayKey);

  let period = false;
  starts.forEach((start) => {
    const end = addDays(start, state.settings.periodLength - 1);
    if (day >= start && day <= end) {
      period = true;
    }
  });

  const predicted = predictions.nextPeriodStart &&
    day >= predictions.nextPeriodStart &&
    day <= addDays(predictions.nextPeriodStart, state.settings.periodLength - 1);
  const fertile = predictions.fertileStart && day >= predictions.fertileStart && day <= predictions.fertileEnd;
  const ovulation = predictions.ovulationDate && isSameDay(day, predictions.ovulationDate);

  return { selectedStart, period, predicted, fertile, ovulation };
}

/**
 * Calculate average cycle length from logged periods
 * @param {Object} state - The application state
 * @returns {number} Average cycle length
 */
function calculateAverageCycleLength(state) {
  const lengths = getCycleLengths(state);
  if (lengths.length === 0) {
    return state.settings.cycleLength;
  }
  return Math.round(lengths.reduce((sum, value) => sum + value, 0) / lengths.length);
}

/**
 * Get cycle lengths from logged period starts
 * @param {Object} state - The application state
 * @returns {Array} Array of cycle lengths
 */
function getCycleLengths(state) {
  const starts = getSortedPeriodStarts(state);
  const lengths = [];
  for (let index = 0; index < starts.length - 1; index += 1) {
    lengths.push(diffInDays(starts[index + 1], starts[index]));
  }
  return lengths;
}

/**
 * Get sorted period start dates
 * @param {Object} state - The application state
 * @returns {Array} Sorted array of Date objects
 */
function getSortedPeriodStarts(state) {
  return state.periods
    .map((dateString) => startOfDay(new Date(dateString)))
    .sort((a, b) => a - b);
}

/**
 * Get relief suggestions for current phase
 * @param {string} phase - The cycle phase
 * @returns {Object} Relief suggestions for exercise and diet
 */
function getPhaseRelief(phase) {
  return reliefByPhase[phase] || reliefByPhase.follicular;
}

/**
 * Get color for a given phase
 * @param {string} phase - The cycle phase
 * @returns {string} CSS variable for the phase color
 */
function getPhaseColor(phase) {
  const colors = {
    menstrual: 'var(--period)',
    follicular: 'var(--accent-3)',
    ovulation: 'var(--ovulation)',
    luteal: 'var(--accent)'
  };
  return colors[phase] || 'var(--accent)';
}