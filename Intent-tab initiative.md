# Intent Tab
### A Browser Extension for Preserving Digital Intent
# Core Idea
Most people do not lose time because they are lazy.
They lose time because the browser destroys intent.
A user opens the browser with a purpose:
- study
- research
- reply to someone
- complete work
- buy something
- solve a problem
Then:
- tabs multiply
- distractions appear
- context switches happen
- the original goal disappears
The browser becomes a chaos machine.
Intent Tab exists to solve this.
# Product Philosophy
Intent Tab is not:
- a productivity app
- a task manager
- a note-taking app
- another AI dashboard
Intent Tab is:
➢ A cognitive continuity tool.
The extension preserves the user’s original intention while browsing.
It acts as a lightweight behavioral layer between the user and the internet.
# Main Problem Statement
Modern browsers optimize:
- speed
- content access
- engagement
But they do NOT optimize:
- attention
- focus continuity
- mental alignment
- intentional browsing
This creates:
- tab overload
- dopamine-driven browsing
- forgotten goals
- fragmented attention
- mental fatigue
# Proposed Solution
Every new browser tab becomes an intentional checkpoint.
Instead of:
- random homepage
- bookmarks
- news feeds
- distractions
The extension asks:
➢ “What are you trying to do right now?”
The user enters a goal.
Example:
- Study DBMS Unit 3
- Research internship opportunities
- Finish portfolio website
- Buy laptop RAM
The browser session is then structured around that intent.
# Core Features
## 1. Intent Capture
The extension captures:
- current goal
- session start time
- optional task category
This creates conscious browsing.
## 2. Session Awareness
The extension continuously remembers:
- current intent
- active browsing session
- browsing duration
The user always sees:
- what they intended to do
- how long they have been doing it
## 3. Distraction Detection
If the user opens:
- YouTube
- Instagram
- Reddit
- unrelated websites
The extension gently intervenes.
Example:
“You opened YouTube while studying DBMS.”
Not aggressive blocking.
Not punishment.
Just awareness restoration.
## 4. Tab Context Grouping
Tabs are grouped according to:
- active intent
- session context
This prevents:
- tab chaos
- context fragmentation
## 5. Daily Analytics
The extension tracks:
- productive browsing time
- distraction time
- task completion ratio
- browsing patterns
Example:
Today’s Usage:
- Study DBMS → 42 min
- Portfolio Work → 28 min
- Distractions → 19 min
# Why This Is Different
Most productivity tools focus on:
- restriction
- blocking
- gamification
- task lists
Intent Tab focuses on:
- Preserving cognitive direction
The extension does not force productivity.
It restores awareness.
# Competitor Analysis
## Existing Products
### Momentum
Beautiful dashboard but lacks behavioral depth.
### StayFocusd
Punishment-based blocking system.
### OneTab
Only solves tab organization.
### Forest
Gamified focus but disconnected from browser behavior.
# Market Gap
No major extension deeply focuses on:
➢ Intent preservation during browsing.
This creates a unique positioning opportunity.
# Product Positioning
## Not:
- productivity extension
- focus app
- tab manager
## Instead:
➢ “A browser extension that remembers what you were trying to do.”
# MVP (Minimum Viable Product)
## Phase 1 Features
### Required
- New tab override
- Intent input
- Local storage
- Active session display
- Basic distraction detection
### Optional
- Analytics dashboard
- Session history
- Focus timer
# Technical Architecture
## Stack
Frontend:
- HTML
- CSS
- Vanilla JavaScript
Browser APIs:
- Chrome Extension APIs
- chrome.storage
- chrome.tabs
Storage:
- Local storage initially
# File Structure
```plaintext
Intent-tab/
│
├── manifest.json
├── newtab.html
├── popup.html
│
├── css/
│ ├── main.css
│ └── animations.css
│
├── js/
│ ├── newtab.js
│ ├── storage.js
│ ├── tracker.js
│ ├── focus.js
│ └── utils.js
│
├── assets/
│ ├── icon16.png
│ ├── icon48.png
│ └── icon128.png