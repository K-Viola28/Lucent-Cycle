/**
 * Main Module - Initialization and event binding
 * Orchestrates the application
 */

let state = loadState();
let currentMonth = new Date();
let selectedSymptoms = new Set();

const elements = {
  comfortMessage: document.getElementById('comfortMessage'),
  phaseRing: document.getElementById('phaseRing'),
  phaseName: document.getElementById('phaseName'),
  phaseDayLabel: document.getElementById('phaseDayLabel'),
  nextPeriodText: document.getElementById('nextPeriodText'),
  ovulationText: document.getElementById('ovulationText'),
  fertileWindowText: document.getElementById('fertileWindowText'),
  averageCycleText: document.getElementById('averageCycleText'),
  cycleCountText: document.getElementById('cycleCountText'),
  averagePeriodText: document.getElementById('averagePeriodText'),
  patternSummary: document.getElementById('patternSummary'),
  historyList: document.getElementById('historyList'),
  exerciseSuggestion: document.getElementById('exerciseSuggestion'),
  dietSuggestion: document.getElementById('dietSuggestion'),
  calendarGrid: document.getElementById('calendarGrid'),
  calendarTitle: document.getElementById('calendarTitle'),
  themeToggle: document.getElementById('themeToggle'),
  prevMonth: document.getElementById('prevMonth'),
  nextMonth: document.getElementById('nextMonth'),
  cycleLengthInput: document.getElementById('cycleLengthInput'),
  periodLengthInput: document.getElementById('periodLengthInput'),
  settingsForm: document.getElementById('settingsForm'),
  resetButton: document.getElementById('resetButton'),
  symptomButtons: document.getElementById('symptomButtons'),
  symptomForm: document.getElementById('symptomForm'),
  symptomDate: document.getElementById('symptomDate'),
  symptomList: document.getElementById('symptomList'),
  reminderToggle: document.getElementById('reminderToggle'),
  reminderStatus: document.getElementById('reminderStatus')
};

/**
 * Initialize the application
 */
function init() {
  applyTheme(elements, state);
  hydrateForms(elements, state);
  setDailyComfortMessage(elements);
  bindEvents();
  renderAll();
}

/**
 * Bind event listeners
 */
function bindEvents() {
  elements.prevMonth.addEventListener('click', () => {
    currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    renderCalendar(elements, state, currentMonth);
  });

  elements.nextMonth.addEventListener('click', () => {
    currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    renderCalendar(elements, state, currentMonth);
  });

  elements.themeToggle.addEventListener('click', () => {
    state.settings.darkMode = !state.settings.darkMode;
    saveState(state);
    applyTheme(elements, state);
  });

  elements.settingsForm.addEventListener('submit', (event) => {
    event.preventDefault();
    state.settings.cycleLength = clampNumber(Number(elements.cycleLengthInput.value), 20, 45, 28);
    state.settings.periodLength = clampNumber(Number(elements.periodLengthInput.value), 2, 10, 5);
    saveState(state);
    renderAll();
  });

  elements.resetButton.addEventListener('click', () => {
    if (!window.confirm('Clear all cycle history, symptoms, and settings?')) {
      return;
    }

    state = structuredClone(defaultState);
    selectedSymptoms = new Set();
    currentMonth = new Date();
    clearAllData();
    hydrateForms(elements, state);
    applyTheme(elements, state);
    renderAll();
  });

  elements.reminderToggle.addEventListener('change', async (event) => {
    state.settings.reminders = event.target.checked;
    saveState(state);
    await updateReminderStatus();
  });

  elements.symptomButtons.addEventListener('click', (event) => {
    const button = event.target.closest('[data-symptom]');
    if (!button) {
      return;
    }

    const symptom = button.dataset.symptom;
    if (selectedSymptoms.has(symptom)) {
      selectedSymptoms.delete(symptom);
      button.classList.remove('active');
    } else {
      selectedSymptoms.add(symptom);
      button.classList.add('active');
    }
  });

  elements.symptomForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const date = elements.symptomDate.value;
    if (!date || selectedSymptoms.size === 0) {
      window.alert('Choose a date and at least one symptom.');
      return;
    }

    state.symptoms[date] = Array.from(selectedSymptoms);
    saveState(state);
    selectedSymptoms.clear();
    syncSymptomButtons(elements, selectedSymptoms);
    renderSymptoms(elements, state);
    renderInsights(elements, state);
  });
}

/**
 * Render all UI components
 */
function renderAll() {
  renderOverview(elements, state);
  renderCalendar(elements, state, currentMonth);
  renderInsights(elements, state);
  renderSymptoms(elements, state);
  renderRelief(elements, state);
  updateReminderStatus();
}

/**
 * Add period start date
 * @param {string} dateKey - Date key (YYYY-MM-DD)
 */
function addPeriodStart(dateKey, state) {
  if (!state.periods.includes(dateKey)) {
    state.periods.push(dateKey);
  }

  state.periods = Array.from(new Set(state.periods)).sort();
  saveState(state);
  renderAll();
}

/**
 * Update reminder status display
 */
async function updateReminderStatus() {
  if (!state.settings.reminders) {
    elements.reminderStatus.textContent = 'Reminders are off.';
    return;
  }

  const predictions = getPredictions(state);
  const reminderText = predictions.nextPeriodStart
    ? `Friendly note: your next predicted period is around ${formatLongDate(predictions.nextPeriodStart)}.`
    : 'Friendly note: mark a period start to begin predictions.';

  if ('Notification' in window) {
    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      elements.reminderStatus.textContent = permission === 'granted'
        ? `${reminderText} Browser notifications are enabled.`
        : `${reminderText} Browser notifications were not enabled.`;
      return;
    }

    elements.reminderStatus.textContent = Notification.permission === 'granted'
      ? `${reminderText} Browser notifications are enabled.`
      : `${reminderText} Browser notifications are blocked.`;
    return;
  }

  elements.reminderStatus.textContent = `${reminderText} This browser does not support notifications.`;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}