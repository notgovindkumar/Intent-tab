// Content script - runs on all websites
// Displays intent widget and distraction notifications

const WIDGET_ID = 'intent-tab-widget-overlay';
const TOAST_CONTAINER_ID = 'intent-tab-toast-container';
const STORAGE_KEY = 'intentTabWidgetPosition';

// Create and inject widget styles
function injectWidgetStyles() {
  if (document.getElementById('intent-tab-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'intent-tab-styles';
  style.textContent = `
    #${WIDGET_ID} {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 280px;
      background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95));
      border: 1px solid rgba(100, 116, 139, 0.3);
      border-radius: 12px;
      padding: 14px 16px;
      font-family: 'Urbanist', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: #f1f5f9;
      z-index: 2147483647;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
      font-size: 13px;
      line-height: 1.4;
      user-select: none;
      transition: all 200ms ease;
    }

    #${WIDGET_ID}.hidden {
      display: none;
    }

    #${WIDGET_ID}.dragging {
      box-shadow: 0 15px 50px rgba(0, 0, 0, 0.6);
      opacity: 0.95;
    }

    #${WIDGET_ID}.minimized {
      width: 50px;
      height: 50px;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
    }

    .intent-widget-header {
      font-weight: 600;
      font-size: 14px;
      margin-bottom: 8px;
      color: #e2e8f0;
      cursor: move;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-right: 4px;
    }

    .widget-minimize-btn {
      background: none;
      border: none;
      color: #94a3b8;
      cursor: pointer;
      font-size: 16px;
      padding: 0 4px;
      transition: color 200ms ease;
    }

    .widget-minimize-btn:hover {
      color: #e2e8f0;
    }

    .intent-widget-title {
      color: #60a5fa;
      font-weight: 500;
      margin-bottom: 4px;
      word-break: break-word;
    }

    .intent-widget-category {
      font-size: 12px;
      color: #94a3b8;
      margin-bottom: 8px;
    }

    .intent-widget-timer {
      font-size: 24px;
      font-weight: 700;
      color: #10b981;
      font-variant-numeric: tabular-nums;
      font-family: 'Courier New', monospace;
      margin-top: 8px;
      text-align: center;
    }

    #${WIDGET_ID}.minimized .intent-widget-content {
      display: none;
    }

    #${WIDGET_ID}.minimized .widget-minimize-btn::before {
      content: '🎯';
      font-size: 24px;
    }

    .widget-content {
      pointer-events: auto;
    }

    #${TOAST_CONTAINER_ID} {
      position: fixed;
      bottom: 320px;
      right: 20px;
      z-index: 2147483646;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
    }

    .intent-toast {
      background: linear-gradient(135deg, rgba(239, 68, 68, 0.95), rgba(220, 38, 38, 0.95));
      color: #fff;
      padding: 12px 16px;
      border-radius: 8px;
      border-left: 4px solid #dc2626;
      font-size: 13px;
      font-weight: 500;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      max-width: 280px;
      pointer-events: auto;
      font-family: 'Urbanist', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      
      opacity: 0;
      transform: translateX(400px);
      transition: opacity 300ms ease, transform 300ms ease;
    }

    .intent-toast.show {
      opacity: 1;
      transform: translateX(0);
    }
  `;
  
  document.head.appendChild(style);
}

// Create widget element
function createWidget() {
  if (document.getElementById(WIDGET_ID)) {
    return document.getElementById(WIDGET_ID);
  }

  const widget = document.createElement('div');
  widget.id = WIDGET_ID;
  widget.className = 'hidden';
  widget.innerHTML = `
    <div class="intent-widget-header">
      <span>🎯 Focus Mode</span>
      <button class="widget-minimize-btn" title="Minimize">−</button>
    </div>
    <div class="intent-widget-content">
      <div class="intent-widget-title" id="widget-intent"></div>
      <div class="intent-widget-category" id="widget-category"></div>
      <div class="intent-widget-timer" id="widget-timer">00:00:00</div>
    </div>
  `;
  
  document.body.appendChild(widget);
  
  // Setup drag functionality
  setupDragWidget(widget);
  
  // Setup minimize button
  const minimizeBtn = widget.querySelector('.widget-minimize-btn');
  minimizeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    widget.classList.toggle('minimized');
  });
  
  // Restore saved position
  restoreWidgetPosition(widget);
  
  return widget;
}

// Setup drag functionality for widget
function setupDragWidget(widget) {
  let isDragging = false;
  let currentX;
  let currentY;
  let initialX;
  let initialY;

  const header = widget.querySelector('.intent-widget-header');
  
  header.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('widget-minimize-btn')) {
      return; // Don't drag when clicking minimize button
    }
    
    isDragging = true;
    initialX = e.clientX - widget.offsetLeft;
    initialY = e.clientY - widget.offsetTop;
    widget.classList.add('dragging');
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;
      
      // Keep within viewport bounds
      currentX = Math.max(0, Math.min(currentX, window.innerWidth - widget.offsetWidth));
      currentY = Math.max(0, Math.min(currentY, window.innerHeight - widget.offsetHeight));
      
      widget.style.left = currentX + 'px';
      widget.style.right = 'auto';
      widget.style.bottom = 'auto';
      widget.style.top = currentY + 'px';
      
      // Save position
      saveWidgetPosition(currentX, currentY);
    }
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    widget.classList.remove('dragging');
  });
}

// Save widget position to storage
function saveWidgetPosition(x, y) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ x, y, minimized: document.getElementById(WIDGET_ID).classList.contains('minimized') }));
  } catch (e) {
    // Silently fail if localStorage is blocked
  }
}

// Restore widget position from storage
function restoreWidgetPosition(widget) {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const { x, y, minimized } = JSON.parse(saved);
      widget.style.left = x + 'px';
      widget.style.right = 'auto';
      widget.style.bottom = 'auto';
      widget.style.top = y + 'px';
      
      if (minimized) {
        widget.classList.add('minimized');
      }
    }
  } catch (e) {
    // Silently fail if localStorage is blocked
  }
}

// Create toast container
function createToastContainer() {
  if (document.getElementById(TOAST_CONTAINER_ID)) {
    return document.getElementById(TOAST_CONTAINER_ID);
  }

  const container = document.createElement('div');
  container.id = TOAST_CONTAINER_ID;
  document.body.appendChild(container);
  return container;
}

// Update widget with session data
async function updateWidget() {
  try {
    const response = await chrome.runtime.sendMessage({ type: 'GET_SESSION' });
    const widget = document.getElementById(WIDGET_ID);
    const intentEl = document.getElementById('widget-intent');
    const categoryEl = document.getElementById('widget-category');
    const timerEl = document.getElementById('widget-timer');

    if (response && response.session && response.session.isActive) {
      intentEl.textContent = response.session.intent || 'Active Intent';
      categoryEl.textContent = response.session.category ? `📁 ${response.session.category}` : '';
      widget.classList.remove('hidden');
      
      // Start timer update
      updateTimer(response.session.startTime, timerEl);
    } else {
      widget.classList.add('hidden');
    }
  } catch (error) {
    // Extension not ready yet
  }
}

// Update timer display
function updateTimer(startTime, timerEl) {
  if (!startTime) return;

  const updateDisplay = () => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const hours = String(Math.floor(elapsed / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
    const seconds = String(elapsed % 60).padStart(2, '0');
    timerEl.textContent = `${hours}:${minutes}:${seconds}`;
  };

  updateDisplay();
  setInterval(updateDisplay, 1000);
}

// Show distraction toast
function showDistractionToast(domain, intent) {
  const container = document.getElementById(TOAST_CONTAINER_ID);
  const toast = document.createElement('div');
  toast.className = 'intent-toast';
  toast.textContent = `⚠️ You opened ${domain} while working on: ${intent}`;
  
  container.appendChild(toast);
  
  // Trigger show animation
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  // Auto-dismiss
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 5000);
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'DISTRACTION_DETECTED') {
    showDistractionToast(message.domain, message.intent);
  } else if (message.type === 'SESSION_CHANGED') {
    updateWidget();
  }
});

// Initialize on page load
function init() {
  // Only inject on http/https pages
  if (!window.location.protocol.startsWith('http')) {
    return;
  }

  injectWidgetStyles();
  createWidget();
  createToastContainer();
  updateWidget();

  // Check for session changes every 5 seconds
  setInterval(updateWidget, 5000);
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
