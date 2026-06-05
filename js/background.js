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
