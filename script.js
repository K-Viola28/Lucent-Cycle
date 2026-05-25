const STORAGE_KEY = "luna-bloom-cycle-tracker";
const comfortMessages = [
  "You're doing great today.",
  "Rest when your body asks for it.",
  "A little softness goes a long way.",
  "Hydration, breath, and gentle care matter.",
  "You deserve comfort and patience.",
  "Small steps still count as progress."
];

const reliefByPhase = {
  menstrual: {
    exercise: "Lean into gentle stretches, short walks, pelvic-opening yoga, and extra rest if cramps feel heavy.",
    diet: "Focus on iron-rich foods like spinach, lentils, beans, and warm soups. Keep water nearby and add magnesium-rich snacks if helpful."
  },
  follicular: {
    exercise: "Energy may start rising here, so light strength training, brisk walks, dance, or beginner cardio can feel supportive.",
    diet: "Aim for balanced meals with protein, colorful vegetables, whole grains, and steady hydration."
  },
  ovulation: {
    exercise: "This phase often suits light workouts, cycling, Pilates, or a slightly more active routine if your energy feels good.",
    diet: "Add fiber, leafy greens, berries, and plenty of water to support digestion and recovery."
  },
  luteal: {
    exercise: "Try lower-impact movement like stretching, restorative yoga, walking, or shorter strength sessions with more recovery time.",
    diet: "Prioritize hydration and foods rich in calcium, complex carbs, and vitamin B6 such as oats, yogurt, bananas, chickpeas, and seeds."
  }
};

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

let state = loadState();
let currentMonth = new Date();
let selectedSymptoms = new Set();

const elements = {
  comfortMessage: document.getElementById("comfortMessage"),
  phaseRing: document.getElementById("phaseRing"),
  phaseName: document.getElementById("phaseName"),
  phaseDayLabel: document.getElementById("phaseDayLabel"),
  nextPeriodText: document.getElementById("nextPeriodText"),
  ovulationText: document.getElementById("ovulationText"),
  fertileWindowText: document.getElementById("fertileWindowText"),
  averageCycleText: document.getElementById("averageCycleText"),
  cycleCountText: document.getElementById("cycleCountText"),
  averagePeriodText: document.getElementById("averagePeriodText"),
  patternSummary: document.getElementById("patternSummary"),
  historyList: document.getElementById("historyList"),
  exerciseSuggestion: document.getElementById("exerciseSuggestion"),
  dietSuggestion: document.getElementById("dietSuggestion"),
  calendarGrid: document.getElementById("calendarGrid"),
  calendarTitle: document.getElementById("calendarTitle"),
  themeToggle: document.getElementById("themeToggle"),
  prevMonth: document.getElementById("prevMonth"),
  nextMonth: document.getElementById("nextMonth"),
  cycleLengthInput: document.getElementById("cycleLengthInput"),
  periodLengthInput: document.getElementById("periodLengthInput"),
  settingsForm: document.getElementById("settingsForm"),
  resetButton: document.getElementById("resetButton"),
  symptomButtons: document.getElementById("symptomButtons"),
  symptomForm: document.getElementById("symptomForm"),
  symptomDate: document.getElementById("symptomDate"),
  symptomList: document.getElementById("symptomList"),
  reminderToggle: document.getElementById("reminderToggle"),
  reminderStatus: document.getElementById("reminderStatus")
};

init();

function init() {
  applyTheme();
  hydrateForms();
  setDailyComfortMessage();
  bindEvents();
  renderAll();
}

function bindEvents() {
  elements.prevMonth.addEventListener("click", () => {
    currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    renderCalendar();
  });

  elements.nextMonth.addEventListener("click", () => {
    currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    renderCalendar();
  });

  elements.themeToggle.addEventListener("click", () => {
    state.settings.darkMode = !state.settings.darkMode;
    saveState();
    applyTheme();
  });

  elements.settingsForm.addEventListener("submit", (event) => {
    event.preventDefault();
    state.settings.cycleLength = clampNumber(Number(elements.cycleLengthInput.value), 20, 45, 28);
    state.settings.periodLength = clampNumber(Number(elements.periodLengthInput.value), 2, 10, 5);
    saveState();
    renderAll();
  });

  elements.resetButton.addEventListener("click", () => {
    if (!window.confirm("Clear all cycle history, symptoms, and settings?")) {
      return;
    }

    state = structuredClone(defaultState);
    selectedSymptoms = new Set();
    currentMonth = new Date();
    saveState();
    hydrateForms();
    applyTheme();
    renderAll();
  });

  elements.reminderToggle.addEventListener("change", async (event) => {
    state.settings.reminders = event.target.checked;
    saveState();
    await updateReminderStatus();
  });

  elements.symptomButtons.addEventListener("click", (event) => {
    const button = event.target.closest("[data-symptom]");
    if (!button) {
      return;
    }

    const symptom = button.dataset.symptom;
    if (selectedSymptoms.has(symptom)) {
      selectedSymptoms.delete(symptom);
      button.classList.remove("active");
    } else {
      selectedSymptoms.add(symptom);
      button.classList.add("active");
    }
  });

  elements.symptomForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const date = elements.symptomDate.value;
    if (!date || selectedSymptoms.size === 0) {
      window.alert("Choose a date and at least one symptom.");
      return;
    }

    state.symptoms[date] = Array.from(selectedSymptoms);
    saveState();
    selectedSymptoms.clear();
    syncSymptomButtons();
    renderSymptoms();
    renderInsights();
  });
}

function renderAll() {
  renderOverview();
  renderCalendar();
  renderInsights();
  renderSymptoms();
  renderRelief();
  updateReminderStatus();
}

function renderOverview() {
  const predictions = getPredictions();
  const today = startOfDay(new Date());
  const cycleInfo = getCurrentCycleDay(today);

  elements.nextPeriodText.textContent = predictions.nextPeriodStart
    ? formatLongDate(predictions.nextPeriodStart)
    : "Add a period start date";
  elements.ovulationText.textContent = predictions.ovulationDate
    ? formatLongDate(predictions.ovulationDate)
    : "-";
  elements.fertileWindowText.textContent = predictions.fertileStart && predictions.fertileEnd
    ? `${formatShortDate(predictions.fertileStart)} - ${formatShortDate(predictions.fertileEnd)}`
    : "-";
  elements.averageCycleText.textContent = `${calculateAverageCycleLength()} days`;

  const currentPhase = getCyclePhase(today);
  const dayLabel = cycleInfo.dayNumber ? `Day ${cycleInfo.dayNumber}` : "No cycle logged";
  elements.phaseName.textContent = capitalize(currentPhase.phase);
  elements.phaseDayLabel.textContent = dayLabel;

  const progress = cycleInfo.dayNumber
    ? Math.min((cycleInfo.dayNumber / state.settings.cycleLength) * 360, 360)
    : 18;
  elements.phaseRing.style.background = `conic-gradient(${getPhaseColor(currentPhase.phase)} ${progress}deg, rgba(255,255,255,0.28) ${progress}deg)`;
}

function renderCalendar() {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const firstWeekday = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();
  const todayKey = formatDateKey(new Date());
  const predictions = getPredictions();

  elements.calendarTitle.textContent = firstDay.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric"
  });
  elements.calendarGrid.innerHTML = "";

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

  // Each day cell gets a visual state so users can read past logs and upcoming predictions at a glance.
  dayCells.forEach(({ date, muted }) => {
    const dayKey = formatDateKey(date);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "calendar-day";
    button.innerHTML = `<span>${date.getDate()}</span>`;

    if (muted) {
      button.classList.add("muted");
    }

    if (dayKey === todayKey) {
      button.classList.add("today");
    }

    const stateForDate = getDateFlags(date, predictions);
    if (stateForDate.period) {
      button.classList.add("period");
      button.dataset.label = "period";
    } else if (stateForDate.ovulation) {
      button.classList.add("ovulation");
      button.dataset.label = "ovulation";
    } else if (stateForDate.fertile) {
      button.classList.add("fertile");
      button.dataset.label = "fertile";
    } else if (stateForDate.predicted) {
      button.classList.add("predicted");
      button.dataset.label = "predicted";
    }

    if (stateForDate.selectedStart) {
      button.classList.add("selected");
      button.dataset.label = "start";
    }

    button.addEventListener("click", () => {
      addPeriodStart(dayKey);
    });

    elements.calendarGrid.appendChild(button);
  });
}

function renderSymptoms() {
  const entries = Object.entries(state.symptoms).sort((a, b) => new Date(b[0]) - new Date(a[0]));
  elements.symptomList.innerHTML = "";

  if (entries.length === 0) {
    elements.symptomList.innerHTML = `<p class="empty-state">No symptoms logged yet. Add your first daily check-in above.</p>`;
    return;
  }

  entries.slice(0, 8).forEach(([date, symptoms]) => {
    const card = document.createElement("article");
    card.className = "symptom-entry";
    card.innerHTML = `
      <div>
        <strong>${formatLongDate(new Date(date))}</strong>
      </div>
      <div class="symptom-tags">
        ${symptoms.map((symptom) => `<span class="symptom-tag">${capitalize(symptom)}</span>`).join("")}
      </div>
    `;
    elements.symptomList.appendChild(card);
  });
}

function renderInsights() {
  const starts = getSortedPeriodStarts();
  const cycleLengths = getCycleLengths();
  const symptomEntries = Object.values(state.symptoms).flat();
  const commonSymptom = findMostCommon(symptomEntries);
  const averagePeriod = state.settings.periodLength;

  elements.cycleCountText.textContent = String(starts.length);
  elements.averagePeriodText.textContent = `${averagePeriod} days`;

  let summary = "Log at least two cycle starts to unlock more personalized patterns.";
  if (starts.length >= 2) {
    summary = `Your average cycle is ${calculateAverageCycleLength()} days. ${
      commonSymptom ? `The most commonly logged symptom is ${commonSymptom}.` : "Keep logging symptoms to spot common patterns."
    }`;
  } else if (commonSymptom) {
    summary = `You've started building symptom history. Right now, ${commonSymptom} appears most often in your logs.`;
  }

  elements.patternSummary.textContent = summary;
  elements.historyList.innerHTML = "";

  if (starts.length === 0) {
    elements.historyList.innerHTML = `<p class="empty-state">Your cycle history will appear here once you mark period start dates on the calendar.</p>`;
    return;
  }

  starts.slice().reverse().forEach((start, index) => {
    const actualIndex = starts.length - 1 - index;
    const nextStart = starts[actualIndex + 1];
    const cycleLengthText = nextStart ? `${diffInDays(nextStart, start)} days` : "Current cycle";
    const row = document.createElement("article");
    row.className = "history-item";
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

function renderRelief() {
  const phase = getCyclePhase(new Date()).phase;
  const relief = reliefByPhase[phase];
  elements.exerciseSuggestion.textContent = relief.exercise;
  elements.dietSuggestion.textContent = relief.diet;
}

function addPeriodStart(dateKey) {
  if (!state.periods.includes(dateKey)) {
    state.periods.push(dateKey);
  }

  state.periods = Array.from(new Set(state.periods)).sort();
  saveState();
  renderAll();
}

function getPredictions() {
  const starts = getSortedPeriodStarts();
  const latestStart = starts.at(-1);

  if (!latestStart) {
    return {
      nextPeriodStart: null,
      fertileStart: null,
      fertileEnd: null,
      ovulationDate: null
    };
  }

  // Basic prediction logic uses the latest logged start plus the user's average cycle length.
  const cycleLength = state.settings.cycleLength;
  const nextPeriodStart = addDays(latestStart, cycleLength);
  const ovulationDate = addDays(nextPeriodStart, -14);
  const fertileStart = addDays(ovulationDate, -5);
  const fertileEnd = addDays(ovulationDate, 1);

  return { nextPeriodStart, ovulationDate, fertileStart, fertileEnd };
}

function getCyclePhase(date) {
  const info = getCurrentCycleDay(date);
  const dayNumber = info.dayNumber;

  if (!dayNumber) {
    return { phase: "follicular" };
  }

  if (dayNumber <= state.settings.periodLength) {
    return { phase: "menstrual" };
  }

  const ovulationDay = state.settings.cycleLength - 14;
  if (dayNumber >= ovulationDay - 4 && dayNumber <= ovulationDay + 1) {
    return { phase: dayNumber === ovulationDay ? "ovulation" : "follicular" };
  }

  if (dayNumber > ovulationDay + 1) {
    return { phase: "luteal" };
  }

  return { phase: "follicular" };
}

function getCurrentCycleDay(date) {
  const starts = getSortedPeriodStarts();
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

function getDateFlags(date, predictions) {
  const day = startOfDay(date);
  const starts = getSortedPeriodStarts();
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

function calculateAverageCycleLength() {
  const lengths = getCycleLengths();
  if (lengths.length === 0) {
    return state.settings.cycleLength;
  }
  return Math.round(lengths.reduce((sum, value) => sum + value, 0) / lengths.length);
}

function getCycleLengths() {
  const starts = getSortedPeriodStarts();
  const lengths = [];
  for (let index = 0; index < starts.length - 1; index += 1) {
    lengths.push(diffInDays(starts[index + 1], starts[index]));
  }
  return lengths;
}

function getSortedPeriodStarts() {
  return state.periods
    .map((dateString) => startOfDay(new Date(dateString)))
    .sort((a, b) => a - b);
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved) {
      return structuredClone(defaultState);
    }
    return {
      settings: { ...defaultState.settings, ...saved.settings },
      periods: Array.isArray(saved.periods) ? saved.periods : [],
      symptoms: saved.symptoms && typeof saved.symptoms === "object" ? saved.symptoms : {}
    };
  } catch (error) {
    return structuredClone(defaultState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function hydrateForms() {
  elements.cycleLengthInput.value = state.settings.cycleLength;
  elements.periodLengthInput.value = state.settings.periodLength;
  elements.reminderToggle.checked = Boolean(state.settings.reminders);
  elements.symptomDate.value = formatDateKey(new Date());
  syncSymptomButtons();
}

function syncSymptomButtons() {
  elements.symptomButtons.querySelectorAll("[data-symptom]").forEach((button) => {
    button.classList.toggle("active", selectedSymptoms.has(button.dataset.symptom));
  });
}

function applyTheme() {
  document.body.classList.toggle("dark-theme", state.settings.darkMode);
  const toggleIcon = elements.themeToggle.querySelector(".toggle-icon");
  toggleIcon.textContent = state.settings.darkMode ? "☀️" : "🌙";
}

function setDailyComfortMessage() {
  const dayOfYear = Math.floor((startOfDay(new Date()) - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const message = comfortMessages[dayOfYear % comfortMessages.length];
  elements.comfortMessage.textContent = message;
}

async function updateReminderStatus() {
  if (!state.settings.reminders) {
    elements.reminderStatus.textContent = "Reminders are off.";
    return;
  }

  const predictions = getPredictions();
  const reminderText = predictions.nextPeriodStart
    ? `Friendly note: your next predicted period is around ${formatLongDate(predictions.nextPeriodStart)}.`
    : "Friendly note: mark a period start to begin predictions.";

  if ("Notification" in window) {
    if (Notification.permission === "default") {
      const permission = await Notification.requestPermission();
      elements.reminderStatus.textContent = permission === "granted"
        ? `${reminderText} Browser notifications are enabled.`
        : `${reminderText} Browser notifications were not enabled.`;
      return;
    }

    elements.reminderStatus.textContent = Notification.permission === "granted"
      ? `${reminderText} Browser notifications are enabled.`
      : `${reminderText} Browser notifications are blocked.`;
    return;
  }

  elements.reminderStatus.textContent = `${reminderText} This browser does not support notifications.`;
}

function addDays(date, amount) {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return startOfDay(result);
}

function diffInDays(laterDate, earlierDate) {
  return Math.round((startOfDay(laterDate) - startOfDay(earlierDate)) / 86400000);
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isSameDay(a, b) {
  return formatDateKey(a) === formatDateKey(b);
}

function formatDateKey(date) {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

function formatLongDate(date) {
  return startOfDay(date).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function formatShortDate(date) {
  return startOfDay(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric"
  });
}

function findMostCommon(values) {
  if (values.length === 0) {
    return "";
  }

  const counts = values.reduce((map, value) => {
    map[value] = (map[value] || 0) + 1;
    return map;
  }, {});

  return capitalize(
    Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]
  );
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function clampNumber(value, min, max, fallback) {
  if (Number.isNaN(value)) {
    return fallback;
  }
  return Math.min(Math.max(value, min), max);
}

function getPhaseColor(phase) {
  const colors = {
    menstrual: "var(--period)",
    follicular: "var(--accent-3)",
    ovulation: "var(--ovulation)",
    luteal: "var(--accent)"
  };
  return colors[phase] || "var(--accent)";
}
