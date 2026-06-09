const popupStatus = document.getElementById('popup-status');
const openNewTabButton = document.getElementById('open-new-tab');
const endSessionButton = document.getElementById('end-session');
const historySection = document.getElementById('history-summary');
const historyList = document.getElementById('history-list');

async function renderPopup() {
  const session = await IntentTabStorage.getSession();
  const history = await IntentTabStorage.getHistory();

  if (session && session.isActive) {
    openNewTabButton.textContent = 'Go to Intent Tab';
    endSessionButton.classList.remove('hidden');
    popupStatus.innerHTML = `
      <strong>${IntentTabUtils.safeText(session.intent)}</strong>
      <div class="meta">Started ${IntentTabUtils.getTimestamp(session.startTime)}</div>
    `;
  } else {
    openNewTabButton.textContent = 'Open Intent Tab';
    endSessionButton.classList.add('hidden');
    popupStatus.innerHTML = '<span>No active intent session.</span>';
  }

  renderHistory(history);
}

function renderHistory(history) {
  historyList.innerHTML = '';

  if (!history.length) {
    historySection.classList.add('hidden');
    return;
  }

  historySection.classList.remove('hidden');

  history.slice(0, 5).forEach((item) => {
    const li = document.createElement('li');
    const duration = IntentTabFocus.formatDuration(item.durationSeconds);
    li.textContent = `${item.intent} — ${duration}`;
    historyList.appendChild(li);
  });
}

openNewTabButton.addEventListener('click', () => {
  IntentTabUtils.openNewTab();
});

endSessionButton.addEventListener('click', async () => {
  const session = await IntentTabStorage.getSession();
  if (!session) {
    return;
  }

  const endedAt = Date.now();
  await IntentTabStorage.appendHistory({
    intent: session.intent,
    category: session.category,
    startedAt: session.startTime,
    endedAt,
    durationSeconds: Math.floor((endedAt - session.startTime) / 1000)
  });

  await IntentTabStorage.clearSession();
  
  // Notify all tabs about session change
  chrome.runtime.sendMessage({ type: 'SESSION_CHANGED' }).catch(() => {});
  
  renderPopup();
});

renderPopup();

// Distraction toast notification
function showDistractionToast(domain, intent) {
  const toastContainer = document.getElementById('popup-toast-container');
  if (!toastContainer) {
    return; // Container not available in popup
  }
  
  const toast = document.createElement('div');
  toast.className = 'distraction-toast';
  toast.textContent = `You opened ${domain} while working on: ${intent}`;
  
  toastContainer.appendChild(toast);
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 5000);
}

// Listen for distraction messages from background service worker
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'DISTRACTION_DETECTED') {
    showDistractionToast(message.domain, message.intent);
  }
});
