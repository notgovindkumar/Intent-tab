const IntentTabFocus = {
  formatDuration(totalSeconds) {
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  },

  elapsedSeconds(session) {
    if (!session || !session.startTime) {
      return 0;
    }
    return Math.floor((Date.now() - session.startTime) / 1000);
  }
};
