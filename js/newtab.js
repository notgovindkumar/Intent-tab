const focusHub = document.querySelector('.focus-hub');
const sessionCard = document.getElementById('session-card');
const intentForm = document.getElementById('intent-form');
const intentInput = document.getElementById('intent-input');
const categoryInput = document.getElementById('category-input');
const categoryLine = document.querySelector('.category-line');
const submitIntentBtn = document.getElementById('submit-intent-btn');
const sessionIntent = document.getElementById('session-intent');
const sessionCategory = document.getElementById('session-category');
const sessionStart = document.getElementById('session-start');
const sessionTimer = document.getElementById('session-timer');
const stopButton = document.getElementById('stop-button');

let activeSession = null;
let timerId = null;
let categoryRevealed = false;

async function refreshView() {
  activeSession = await IntentTabStorage.getSession();
  const sessionActive = activeSession && activeSession.isActive;

  focusHub.classList.toggle('hidden', sessionActive);
  sessionCard.classList.toggle('hidden', !sessionActive);

  if (sessionActive) {
    sessionIntent.textContent = IntentTabUtils.safeText(activeSession.intent);
    sessionCategory.textContent = IntentTabUtils.safeText(activeSession.category) || 'Intent';
    sessionStart.textContent = IntentTabUtils.getTimestamp(activeSession.startTime);
    updateTimer();
    startTimer();
  } else {
    stopTimer();
  }
}

function revealCategory() {
  if (categoryRevealed) {
    return;
  }

  categoryRevealed = true;
  categoryLine.classList.remove('hidden');
  categoryLine.classList.add('visible');
}

function resetForm() {
  categoryRevealed = false;
  categoryLine.classList.add('hidden');
  categoryLine.classList.remove('visible');
  intentForm.reset();
  intentInput.focus();
}

function updateTimer() {
  if (!activeSession) {
    sessionTimer.textContent = '00:00:00';
    return;
  }

  const seconds = IntentTabFocus.elapsedSeconds(activeSession);
  sessionTimer.textContent = IntentTabFocus.formatDuration(seconds);
}

function startTimer() {
  if (timerId) {
    return;
  }

  timerId = setInterval(updateTimer, 1000);
}

function stopTimer() {
  if (!timerId) {
    return;
  }

  clearInterval(timerId);
  timerId = null;
}

async function submitIntent() {
  const intent = intentInput.value.trim();
  const category = categoryInput.value.trim();

  if (!intent) {
    intentInput.focus();
    return;
  }

  activeSession = {
    intent,
    category,
    startTime: Date.now(),
    isActive: true
  };

  await IntentTabStorage.saveSession(activeSession);
  refreshView();
}

intentForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  await submitIntent();
});

intentInput.addEventListener('input', (event) => {
  const hasText = event.target.value.trim().length > 0;
  if (hasText) {
    revealCategory();
  } else {
    categoryRevealed = false;
    categoryLine.classList.add('hidden');
    categoryLine.classList.remove('visible');
  }
});

intentInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    if (intentInput.value.trim().length > 0) {
      revealCategory();
    }
  }
});

categoryInput.addEventListener('keydown', async (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    await submitIntent();
  }
});

submitIntentBtn.addEventListener('click', async (event) => {
  event.preventDefault();
  await submitIntent();
});

stopButton.addEventListener('click', async () => {
  if (!activeSession) {
    return;
  }

  const endedAt = Date.now();
  await IntentTabStorage.appendHistory({
    intent: activeSession.intent,
    category: activeSession.category,
    startedAt: activeSession.startTime,
    endedAt,
    durationSeconds: Math.floor((endedAt - activeSession.startTime) / 1000)
  });

  await IntentTabStorage.clearSession();
  activeSession = null;
  resetForm();
  refreshView();
});

refreshView();
