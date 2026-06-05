# Intent Tab

A browser extension that replaces the new tab page with an intentional checkpoint. Users capture their current goal and preserve browsing context instead of letting tabs become distractions.

## Included files
- `manifest.json`
- `newtab.html`
- `popup.html`
- `css/main.css`
- `css/animations.css`
- `js/newtab.js`
- `js/popup.js`
- `js/storage.js`
- `js/background.js`
- `js/focus.js`
- `js/utils.js`
- `js/tracker.js`
- `assets/icon16.svg`
- `assets/icon48.svg`
- `assets/icon128.svg`

## Install locally
1. Open Chrome and go to `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select the `Intent-tab` folder.

## What it does
- Opens a custom new tab page for entering a browsing intent.
- Saves session data in Chrome storage.
- Displays active intent and elapsed time.
- Monitors browsing sites and marks common distractions.
- Provides a popup with current session status and history.
