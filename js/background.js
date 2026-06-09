const DISTRACTION_HOSTS = [
  'youtube.com',
  'www.youtube.com',
  'reddit.com',
  'www.reddit.com',
  'instagram.com',
  'www.instagram.com',
  'tiktok.com',
  'www.tiktok.com',
  'twitter.com',
  'www.twitter.com',
  'facebook.com',
  'www.facebook.com'
];

function isDistractionUrl(url) {
  if (!url) {
    return false;
  }

  try {
    const parsed = new URL(url);
    return DISTRACTION_HOSTS.some((host) => parsed.hostname.includes(host));
  } catch (error) {
    return false;
  }
}

function maybeNotifyTab(tab) {
  if (!tab || !tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('file://')) {
    return;
  }

  chrome.storage.local.get(['intentTabSession'], (result) => {
    const session = result.intentTabSession;
    if (!session || !session.isActive) {
      chrome.action.setBadgeText({ text: '' });
      return;
    }

    if (isDistractionUrl(tab.url)) {
      chrome.action.setBadgeText({ text: '!' });
      chrome.action.setBadgeBackgroundColor({ color: '#dc2626' });
      chrome.storage.local.set({ lastDistraction: { url: tab.url, time: Date.now() } });
      
      // Send message to notify the specific tab's content script about distraction
      const domain = new URL(tab.url).hostname.replace('www.', '');
      const message = {
        type: 'DISTRACTION_DETECTED',
        domain: domain,
        intent: session.intent
      };
      
      // Send to the specific tab that has the distraction
      chrome.tabs.sendMessage(tab.id, message).catch(() => {
        // Silently ignore if tab doesn't have content script
      });
      
      // Also notify extension pages (newtab, popup)
      chrome.runtime.sendMessage(message).catch(() => {});
    } else {
      chrome.action.setBadgeText({ text: '' });
    }
  });
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.active) {
    maybeNotifyTab(tab);
  }
});

chrome.tabs.onActivated.addListener(({ tabId }) => {
  chrome.tabs.get(tabId, (tab) => {
    maybeNotifyTab(tab);
  });
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({ text: '' });
});

// Handle messages from content scripts and extension pages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_SESSION') {
    chrome.storage.local.get(['intentTabSession'], (result) => {
      sendResponse({ session: result.intentTabSession || null });
    });
    return true; // Keep channel open for async response
  } else if (message.type === 'SESSION_CHANGED') {
    // Broadcast SESSION_CHANGED to all tabs
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(tab.id, { type: 'SESSION_CHANGED' }).catch(() => {});
      });
    });
  }
});
