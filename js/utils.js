const IntentTabUtils = {
  getTimestamp(date) {
    if (!date) return '';
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  },

  safeText(text) {
    return String(text || '').trim();
  },

  openNewTab(url = 'newtab.html') {
    chrome.tabs.create({ url });
  }
};
