Project Overview
YouTube Focus Guard is a Chrome browser extension designed to help developers and knowledge workers maintain focus by automatically filtering YouTube content. The extension monitors YouTube videos in real-time and only allows educational content related to programming, web development, AI, and entrepreneurship. Any video that doesn't match your approved categories is automatically paused and blocked with a friendly reminder.
Purpose:

Eliminate distractions from entertainment, music, and non-work content
Create a distraction-free learning environment
Build better work habits through automated content filtering
Stay focused on skill development and professional growth

How Content Scripts Interact with YouTube
Content scripts are injected into YouTube pages and have access to the DOM (Document Object Model). They can:

1. Read the video title from the page
2. Access the video player element
3. Pause/play videos programmatically
4. Add overlays and UI elements
5. Listen for navigation changes (YouTube is a Single Page Application)

┌─────────────────────────────────────────┐
│         Chrome Browser                   │
│  ┌────────────────────────────────────┐ │
│  │      YouTube Tab                    │ │
│  │  ┌──────────────────────────────┐  │ │
│  │  │   Content Script (content.js) │  │ │
│  │  │   - Monitors video player     │  │ │
│  │  │   - Reads video title         │  │ │
│  │  │   - Checks against keywords   │  │ │
│  │  │   - Pauses/blocks if needed   │  │ │
│  │  └──────────────────────────────┘  │ │
│  └────────────────────────────────────┘ │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │  Extension Popup (popup.html)      │ │
│  │  - View statistics                 │ │
│  │  - Toggle on/off                   │ │
│  │  - Quick settings                  │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘

// YouTube stores the title in this element
const titleElement = document.querySelector('h1.ytd-watch-metadata yt-formatted-string');
const videoTitle = titleElement?.textContent || '';
```

### 3. **Decision Making Process**
```
┌─────────────────────────┐
│  Get Video Title        │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Convert to Lowercase   │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Check Against Allowed  │
│  Keywords List          │
└───────────┬─────────────┘
            │
     ┌──────┴──────┐
     │             │
     ▼             ▼
┌─────────┐   ┌─────────┐
│ Match   │   │No Match │
│ Found   │   │         │
└────┬────┘   └────┬────┘
     │             │
     ▼             ▼
┌─────────┐   ┌─────────┐
│ Allow   │   │ Pause & │
│ Video   │   │ Block   │
└─────────┘   └─────────┘

// Pause the video
const video = document.querySelector('video');
video.pause();

// Show blocking overlay
showBlockOverlay(videoTitle);
```

---

## Complete Folder Structure
```
youtube-focus-guard/
│
├── manifest.json           # Extension configuration
├── content.js             # Main logic for video filtering
├── background.js          # Service worker (optional)
├── popup.html             # Extension popup UI
├── popup.js               # Popup logic
├── popup.css              # Popup styles
├── styles.css             # Content script styles (for overlay)
│
├── icons/                 # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
│
└── README.md              # Documentation