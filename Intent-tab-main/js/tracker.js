window.IntentTabTracker = {
  distractionHosts: [
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
  ],

  isDistractionUrl(url) {
    if (!url) {
      return false;
    }

    try {
      const parsed = new URL(url);
      return this.distractionHosts.some((host) => parsed.hostname.includes(host));
    } catch (error) {
      return false;
    }
  }
};
