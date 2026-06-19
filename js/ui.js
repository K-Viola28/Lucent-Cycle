/**
 * UI Module - DOM rendering and updates
 */

const comfortMessages = [
  "You're doing great today.",
  'Rest when your body asks for it.',
  'A little softness goes a long way.',
  'Hydration, breath, and gentle care matter.',
  'You deserve comfort and patience.',
  'Small steps still count as progress.'
];

/**
 * Render overview panel (next period, ovulation, etc.)
 * @param {Object} elements - DOM elements
 * @param {Object} state - Application state
 */
function renderOverview(elements, state) {
  const predictions = getPredictions(state);
  const today = startOfDay(new Date());
  const cycleInfo = getCurrentCycleDay(today, state);

  elements.nextPeriodText.textContent = predictions.nextPeriodStart
    ? formatLongDate(predictions.nextPeriodStart)
    : 'Add a period start date';
  elements.ovulationText.textContent = predictions.ovulationDate
    ? formatLongDate(predictions.ovulationDate)
    : '-';
  elements.fertileWindowText.textContent = predictions.fertileStart && predictions.fertileEnd
    ? `${formatShortDate(predictions.fertileStart)} - ${formatShortDate(predictions.fertileEnd)}`
    : '-';
  elements.averageCycleText.textContent = `${calculateAverageCycleLength(state)} days`;

  const currentPhase = getCyclePhase(today, state);
  const dayLabel = cycleInfo.dayNumber ? `Day ${cycleInfo.dayNumber}` : 'No cycle logged';
  elements.phaseName.textContent = capitalize(currentPhase.phase);
  elements.phaseDayLabel.textContent = dayLabel;

  const progress = cycleInfo.dayNumber
    ? Math.min((cycleInfo.dayNumber / state.settings.cycleLength) * 360, 360)
    : 18;
  elements.phaseRing.style.background = `conic-gradient(${getPhaseColor(currentPhase.phase)} ${progress}deg, rgba(255,255,255,0.28) ${progress}deg)`;
}

/**
 * Render calendar grid
 * @param {Object} elements - DOM elements
 * @param {Object} state - Application state
 */
function renderCalendar(elements, state, currentMonth) {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const firstWeekday = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();
  const todayKey = formatDateKey(new Date());
  const predictions = getPredictions(state);

  elements.calendarTitle.textContent = firstDay.toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric'
  });
  elements.calendarGrid.innerHTML = '';

  const dayCells = [];

  for (let i = firstWeekday - 1; i >= 0; i -= 1) {
    dayCells.push({
      date: new Date(year, month - 1, prevMonthDays - i),
      muted: true
    });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    dayCells.push({
      date: new Date(year, month, day),
      muted: false
    });
  }

  const remaining = (7 - (dayCells.length % 7)) % 7;
  for (let day = 1; day <= remaining; day += 1) {
    dayCells.push({
      date: new Date(year, month + 1, day),
      muted: true
    });
  }

  dayCells.forEach(({ date, muted }) => {
    const dayKey = formatDateKey(date);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'calendar-day';
    button.innerHTML = `<span>${date.getDate()}</span>`;
    button.setAttribute('aria-label', `${date.toDateString()}`);

    if (muted) {
      button.classList.add('muted');
    }

    if (dayKey === todayKey) {
      button.classList.add('today');
    }

    const stateForDate = getDateFlags(date, state, predictions);
    if (stateForDate.period) {
      button.classList.add('period');
      button.dataset.label = 'period';
    } else if (stateForDate.ovulation) {
      button.classList.add('ovulation');
      button.dataset.label = 'ovulation';
    } else if (stateForDate.fertile) {
      button.classList.add('fertile');
      button.dataset.label = 'fertile';
    } else if (stateForDate.predicted) {
      button.classList.add('predicted');
      button.dataset.label = 'predicted';
    }

    if (stateForDate.selectedStart) {
      button.classList.add('selected');
      button.dataset.label = 'start';
    }

    button.addEventListener('click', () => {
      addPeriodStart(dayKey, state);
    });

    elements.calendarGrid.appendChild(button);
  });
}

/**
 * Render symptom list
 * @param {Object} elements - DOM elements
 * @param {Object} state - Application state
 */
function renderSymptoms(elements, state) {
  const entries = Object.entries(state.symptoms).sort((a, b) => new Date(b[0]) - new Date(a[0]));
  elements.symptomList.innerHTML = '';

  if (entries.length === 0) {
    elements.symptomList.innerHTML = `<p class="empty-state">No symptoms logged yet. Add your first daily check-in above.</p>`;
    return;
  }

  entries.slice(0, 8).forEach(([date, symptoms]) => {
    const card = document.createElement('article');
    card.className = 'symptom-entry';
    card.innerHTML = `
      <div>
        <strong>${formatLongDate(new Date(date))}</strong>
      </div>
      <div class="symptom-tags">
        ${symptoms.map((symptom) => `<span class="symptom-tag">${capitalize(symptom)}</span>`).join('')}
      </div>
    `;
    elements.symptomList.appendChild(card);
  });
}

/**
 * Render insights and history
 * @param {Object} elements - DOM elements
 * @param {Object} state - Application state
 */
function renderInsights(elements, state) {
  const starts = getSortedPeriodStarts(state);
  const cycleLengths = getCycleLengths(state);
  const symptomEntries = Object.values(state.symptoms).flat();
  const commonSymptom = findMostCommon(symptomEntries);
  const averagePeriod = state.settings.periodLength;

  elements.cycleCountText.textContent = String(starts.length);
  elements.averagePeriodText.textContent = `${averagePeriod} days`;

  let summary = 'Log at least two cycle starts to unlock more personalized patterns.';
  if (starts.length >= 2) {
    summary = `Your average cycle is ${calculateAverageCycleLength(state)} days. ${
      commonSymptom ? `The most commonly logged symptom is ${commonSymptom}.` : 'Keep logging symptoms to spot common patterns.'
    }`;
  } else if (commonSymptom) {
    summary = `You've started building symptom history. Right now, ${commonSymptom} appears most often in your logs.`;
  }

  elements.patternSummary.textContent = summary;
  elements.historyList.innerHTML = '';

  if (starts.length === 0) {
    elements.historyList.innerHTML = `<p class="empty-state">Your cycle history will appear here once you mark period start dates on the calendar.</p>`;
    return;
  }

  starts.slice().reverse().forEach((start, index) => {
    const actualIndex = starts.length - 1 - index;
    const nextStart = starts[actualIndex + 1];
    const cycleLengthText = nextStart ? `${diffInDays(nextStart, start)} days` : 'Current cycle';
    const row = document.createElement('article');
    row.className = 'history-item';
    row.innerHTML = `
      <div>
        <strong>${formatLongDate(start)}</strong>
        <div class="tiny-text">Period start</div>
      </div>
      <div>
        <strong>${cycleLengthText}</strong>
      </div>
    `;
    elements.historyList.appendChild(row);
  });
}

/**
 * Render relief suggestions
 * @param {Object} elements - DOM elements
 * @param {Object} state - Application state
 */
function renderRelief(elements, state) {
  const phase = getCyclePhase(new Date(), state).phase;
  const relief = getPhaseRelief(phase);
  elements.exerciseSuggestion.textContent = relief.exercise;
  elements.dietSuggestion.textContent = relief.diet;
}

/**
 * Set daily comfort message
 * @param {Object} elements - DOM elements
 */
function setDailyComfortMessage(elements) {
  const dayOfYear = Math.floor((startOfDay(new Date()) - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const message = comfortMessages[dayOfYear % comfortMessages.length];
  elements.comfortMessage.textContent = message;
}

/**
 * Apply theme (dark/light mode)
 * @param {Object} elements - DOM elements
 * @param {Object} state - Application state
 */
function applyTheme(elements, state) {
  document.body.classList.toggle('dark-theme', state.settings.darkMode);
  const toggleIcon = elements.themeToggle.querySelector('.toggle-icon');
  toggleIcon.textContent = state.settings.darkMode ? '☀️' : '🌙';
}

/**
 * Sync symptom button states with selected symptoms
 * @param {Object} elements - DOM elements
 * @param {Set} selectedSymptoms - Currently selected symptoms
 */
function syncSymptomButtons(elements, selectedSymptoms) {
  elements.symptomButtons.querySelectorAll('[data-symptom]').forEach((button) => {
    button.classList.toggle('active', selectedSymptoms.has(button.dataset.symptom));
  });
}

/**
 * Hydrate form inputs from state
 * @param {Object} elements - DOM elements
 * @param {Object} state - Application state
 */
function hydrateForms(elements, state) {
  elements.cycleLengthInput.value = state.settings.cycleLength;
  elements.periodLengthInput.value = state.settings.periodLength;
  elements.reminderToggle.checked = Boolean(state.settings.reminders);
  elements.symptomDate.value = formatDateKey(new Date());
}