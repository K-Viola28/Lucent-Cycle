/**
 * Main Module - Initialization and event binding
 * Orchestrates the application
 */

let state = loadState();
let currentMonth = new Date();
let selectedSymptoms = new Set();
let lastRenderedPhase = null;

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
  reminderStatus: document.getElementById('reminderStatus'),
  reliefPanel: document.querySelector('.relief-panel'),
  exportCSVButton: null,
  exportJSONButton: null,
  importButton: null
};

/**
 * Initialize the application
 */
function init() {
  applyTheme(elements, state);
  hydrateForms(elements, state);
  setDailyComfortMessage(elements);
  createExportImportButtons();
  bindEvents();
  renderAll();
}

/**
 * Create export/import buttons in settings
 */
function createExportImportButtons() {
  const settingsPanel = document.querySelector('.settings-panel');
  if (!settingsPanel) return;

  const exportSection = document.createElement('div');
  exportSection.className = 'settings-actions';
  exportSection.style.marginTop = '1rem';
  exportSection.innerHTML = `
    <button class="soft-button" id="exportCSV" type="button" aria-label="Export data as CSV">Export CSV</button>
    <button class="soft-button" id="exportJSON" type="button" aria-label="Export data as JSON">Export JSON</button>
    <button class="soft-button" id="importButton" type="button" aria-label="Import data from JSON">Import Data</button>
    <input type="file" id="importInput" accept=".json" style="display: none;" aria-label="Select JSON file to import">
  `;
  
  settingsPanel.appendChild(exportSection);

  elements.exportCSVButton = document.getElementById('exportCSV');
  elements.exportJSONButton = document.getElementById('exportJSON');
  elements.importButton = document.getElementById('importButton');
  const importInput = document.getElementById('importInput');

  elements.exportCSVButton.addEventListener('click', () => {
    exportToCSV(state);
    alert('Data exported as CSV.');
  });

  elements.exportJSONButton.addEventListener('click', () => {
    exportToJSON(state);
    alert('Data exported as JSON.');
  });

  elements.importButton.addEventListener('click', () => {
    importInput.click();
  });

  importInput.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const imported = await importFromJSON(file);
      const confirmImport = window.confirm(
        'This will replace your current data. Continue?\n\nBacked up your data first?'
      );
      if (!confirmImport) return;

      state = {
        settings: { ...defaultState.settings, ...imported.settings },
        periods: Array.isArray(imported.periods) ? imported.periods : [],
        symptoms: imported.symptoms && typeof imported.symptoms === 'object' ? imported.symptoms : {}
      };
      saveState(state);
      hydrateForms(elements, state);
      renderAll();
      alert('Data imported successfully!');
    } catch (error) {
      alert(`Import failed: ${error.message}`);
    }
    
    importInput.value = '';
  });
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
    const cycleLength = Number(elements.cycleLengthInput.value);
    const periodLength = Number(elements.periodLengthInput.value);

    const validation = validateSettings(cycleLength, periodLength);
    if (!validation.isValid) {
      alert(validation.message);
      return;
    }

    state.settings.cycleLength = cycleLength;
    state.settings.periodLength = periodLength;
    saveState(state);
    alert(validation.message);
    renderAll();
  });

  elements.resetButton.addEventListener('click', () => {
    if (!window.confirm('Clear all cycle history, symptoms, and settings?\n\nThis cannot be undone. Make sure you\'ve exported your data!')) {
      return;
    }

    state = structuredClone(defaultState);
    selectedSymptoms = new Set();
    currentMonth = new Date();
    clearAllData();
    hydrateForms(elements, state);
    applyTheme(elements, state);
    renderAll();
    alert('All data cleared.');
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
      button.setAttribute('aria-pressed', 'false');
    } else {
      selectedSymptoms.add(symptom);
      button.classList.add('active');
      button.setAttribute('aria-pressed', 'true');
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
    alert('Symptom logged successfully!');
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
  checkPhaseChange();
  updateReminderStatus();
}

/**
 * Check if phase has changed and announce it
 */
function checkPhaseChange() {
  const currentPhase = getCyclePhase(new Date(), state).phase;
  if (lastRenderedPhase !== currentPhase) {
    lastRenderedPhase = currentPhase;
    const phasePanel = elements.reliefPanel;
    if (phasePanel) {
      phasePanel.setAttribute('aria-live', 'polite');
      phasePanel.textContent = `Now in ${capitalize(currentPhase)} phase`;
      setTimeout(() => {
        phasePanel.removeAttribute('aria-live');
      }, 3000);
    }
  }
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
