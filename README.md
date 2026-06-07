# Intent-tab

An intelligent, tab-based intent parsing and session routing workspace. This extension/UI layer acts as a streamlined command center that processes user intents, visualizes active session parameters via custom interface blocks, and seamlessly handles web-search utilities via real-time Google Search integration.

This version introduces complete functional updates across the UI presentation layers and active tool backings.

---

## 🚀 Key Features (Latest Release)

*   **Google Search Integration:** Native real-time web integration that intercepts queries requiring fresh factual contexts and bridges search engine results directly into your active session framework.
*   **Optimized Session Cards:** Completely reworked UI layouts for active cards, offering clearer parameter tracing, lighter screen footprints, and better state feedback.
*   **Intelligent Intent Tab Layout:** A unified tab workspace designed to help developers or power-users manage, isolate, and debug active processing sessions on the fly.
*   **Client-Side Ingestion and Cleaning:** Immediate sanitization of inputs before execution queries are fired, cutting out unneeded data bloat or execution overhead.

---

## 📐 Unified System Architecture Layout

```text
       [ User Input Terminal ]
                  │
                  ▼
      ┌─────────────────────────┐
      │   Intent-tab UI Panel   │ <─── [ Custom Session Cards ]
      │ (Pre-processes & Trims) │      (Live Status, Variables)
      └───────────┬─────────────┘
                  │
                  ▼
      ┌─────────────────────────┐
      │  Intent Router Engine   │
      └─────┬─────────────┬─────┘
            │             │
      [ Intent Match ]   [ Real-Time Data Needed? ]
            │             │
            │             ▼
            │     ┌──────────────┐
            │     │ Google Search│
            │     │ Integration  │
            │     └──────┬───────┘
            │            │ (Live Web Context)
            ▼            ▼
      ┌─────────────────────────┐
      │ Unified Output Contract │
      │  (Validated Payload)    │
      └───────────┬─────────────┘
                  │
                  ▼
        [ Session Dispatch ]

## 📂 Project Structure

        Intent-tab/
├── public/               # Static assets, icons, and base system manifest files
├── src/
│   ├── components/
│   │   ├── SessionCard.tsx  # Optimized user session dashboard cards
│   │   └── TabRouter.tsx   # Core tab execution view panel
│   ├── core/
│   │   ├── searchAgent.ts  # Native Google Search API hooks & injection logic
│   │   └── intentParser.ts # Token string cleaners and pattern matchers
│   ├── hooks/
│   │   └── useSession.ts   # React state-hooks managing internal session memory
│   ├── App.tsx             # Root structural application component
│   └── main.tsx            # Application launch entry point
├── .env.example          # Sample client configuration tokens
├── package.json          # Node dependencies and build pipeline commands
└── README.md             # Core system documentation

## 🛠️ Environment Configuration & Installation

Open your browser and navigate to the extensions management dashboard:

URL: chrome://extensions

Toggle the Developer mode switch in the top-right corner to ON.

Click the Load unpacked button in the top-left corner.

Select the root Intent-tab repository folder containing the manifest.json file.

The extension is now live! Pin it to your toolbar for easy access.