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



graph TB
    subgraph "Client Layer"
        WEB[Customer Booking Web]
        ADMIN[Admin Dashboard]
        STAFF[Staff Mobile Web]
    end

    subgraph "CDN & Edge"
        CDN[CloudFlare CDN]
        WAF[Web Application Firewall]
    end

    subgraph "API Gateway Layer"
        KONG[Kong API Gateway]
        RATELIMIT[Rate Limiter]
    end

    subgraph "Microservices"
        AUTH[Auth Service]
        CORE[Core Service<br/>Bookings + Services + Staff]
        INV[Inventory Service]
        PAY[Payment Service]
        NOTIF[Notification Service]
        ANALYTICS[Analytics Service]
        AI[AI / Recommendation Service]
    end

    subgraph "Data Layer"
        PGPRIMARY[(PostgreSQL Primary)]
        PGREPLICA[(PostgreSQL Replicas)]
        REDIS[(Redis Cluster)]
        S3[S3 Object Storage]
    end

    subgraph "Message & Jobs"
        RABBITMQ[RabbitMQ Cluster]
        BULLMQ[BullMQ Workers]
    end

    subgraph "External Services"
        STRIPE[Stripe / Paddle]
        WHATSAPP[WhatsApp Business API]
        SMS[Twilio SMS]
        EMAIL[SendGrid]
        CALENDAR[Google Calendar API]
    end

    subgraph "Observability"
        PROM[Prometheus]
        GRAFANA[Grafana]
        ELK[ELK Stack]
        SENTRY[Sentry]
    end

    %% Client → Edge → Gateway
    WEB --> CDN
    ADMIN --> CDN
    STAFF --> CDN
    CDN --> WAF
    WAF --> KONG
    KONG --> RATELIMIT

    %% Gateway → Microservices
    RATELIMIT --> AUTH
    RATELIMIT --> CORE
    RATELIMIT --> INV
    RATELIMIT --> PAY
    RATELIMIT --> NOTIF
    RATELIMIT --> ANALYTICS
    RATELIMIT --> AI

    %% Microservices → Data Stores
    AUTH --> PGPRIMARY
    CORE --> PGPRIMARY
    INV --> PGPRIMARY
    PAY --> PGPRIMARY
    ANALYTICS --> PGREPLICA

    AUTH --> REDIS
    CORE --> REDIS
    PAY --> REDIS

    CORE --> RABBITMQ
    INV --> RABBITMQ
    PAY --> RABBITMQ
    NOTIF --> RABBITMQ

    RABBITMQ --> BULLMQ

    %% External Integrations
    PAY --> STRIPE
    NOTIF --> WHATSAPP
    NOTIF --> SMS
    NOTIF --> EMAIL
    CORE --> CALENDAR

    AUTH --> S3
    ADMIN --> S3

    %% Observability (metrics & logs)
    AUTH -.-> PROM
    CORE -.-> PROM
    INV -.-> PROM
    PAY -.-> PROM
    PROM --> GRAFANA

    AUTH -.-> ELK
    CORE -.-> ELK
    INV -.-> ELK
    PAY -.-> ELK

    AUTH -.-> SENTRY
    CORE -.-> SENTRY

│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
│
└── README.md              # Documentation
