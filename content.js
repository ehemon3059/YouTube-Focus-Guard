// YouTube Focus Guard - Content Script

// Allowed keywords for work-related videos
const ALLOWED_KEYWORDS = [
  // Programming Languages
  'php', 'javascript', 'python', 'typescript',
  
  // Web Technologies
  'nodejs', 'node.js', 'react', 'reactjs', 'nextjs', 'next.js',
  'remix', 'remixjs', 'express', 'expressjs',
  'html', 'css', 'tailwind', 'tailwindcss',
  
  // Databases
  'mysql', 'postgresql', 'postgres', 'mongodb', 'sql',
  'database', 'relational database', 'nosql', 'non-relational',
  
  // Development Concepts
  'programming', 'coding', 'tutorial', 'development',
  'web development', 'software', 'algorithm',
  'dynamic website', 'static website', 'wordpress',
  
  // DevOps & Security
  'devops', 'server', 'security', 'web security',
  'server security', 'deployment', 'docker', 'kubernetes',
  
  // AI & Advanced Topics
  'artificial intelligence', 'ai', 'machine learning',
  'agi', 'gpt', 'neural network', 'deep learning',
  
  // Business & Entrepreneurship
  'startup', 'founder', 'entrepreneur', 'business',
  'saas', 'product development', 'tech company',
  
  // Tools & Frameworks
  'electron', 'electronjs', 'git', 'github',
  'vscode', 'visual studio', 'api', 'rest api',
  
  // Learning Keywords
  'course', 'lesson', 'learn', 'guide', 'how to',
  'explained', 'introduction to', 'beginner',
  'advanced', 'crash course', 'full course'
];

// Common blocking keywords (entertainment, music, etc.)
const BLOCKED_KEYWORDS = [
  'music video', 'official music', 'lyrics',
  'gaming', 'gameplay', 'let\'s play',
  'vlog', 'prank', 'challenge',
  'reaction', 'funny moments', 'compilation',
  'trailer', 'movie', 'tv show',
  'entertainment', 'celebrity', 'gossip'
];

// Statistics
let stats = {
  videosBlocked: 0,
  videosAllowed: 0,
  lastUpdated: Date.now()
};

// Load stats from storage
chrome.storage.local.get(['stats'], (result) => {
  if (result.stats) {
    stats = result.stats;
  }
});

// Check if extension is enabled
let isEnabled = true;
chrome.storage.local.get(['enabled'], (result) => {
  isEnabled = result.enabled !== false;
});

// Listen for enable/disable messages
chrome.storage.onChanged.addListener((changes) => {
  if (changes.enabled) {
    isEnabled = changes.enabled.newValue;
    if (isEnabled) {
      checkCurrentVideo();
    } else {
      removeBlockOverlay();
    }
  }
});

/**
 * Check if video title matches allowed keywords
 */
function isVideoAllowed(title) {
  const lowerTitle = title.toLowerCase();
  
  // First check if it explicitly matches blocked keywords
  for (const keyword of BLOCKED_KEYWORDS) {
    if (lowerTitle.includes(keyword.toLowerCase())) {
      return false;
    }
  }
  
  // Then check if it matches allowed keywords
  for (const keyword of ALLOWED_KEYWORDS) {
    if (lowerTitle.includes(keyword.toLowerCase())) {
      return true;
    }
  }
  
  // If no match found, block by default
  return false;
}

/**
 * Get video title from YouTube page
 */
function getVideoTitle() {
  // Try multiple selectors as YouTube's DOM can vary
  const selectors = [
    'h1.ytd-watch-metadata yt-formatted-string',
    'h1.title.ytd-video-primary-info-renderer',
    'h1 yt-formatted-string.ytd-watch-metadata'
  ];
  
  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element?.textContent) {
      return element.textContent.trim();
    }
  }
  
  return '';
}

/**
 * Get video player element
 */
function getVideoPlayer() {
  return document.querySelector('video');
}

/**
 * Pause the video
 */
function pauseVideo() {
  const video = getVideoPlayer();
  if (video && !video.paused) {
    video.pause();
  }
}

/**
 * Show blocking overlay
 */
function showBlockOverlay(title) {
  // Remove existing overlay if present
  removeBlockOverlay();
  
  const overlay = document.createElement('div');
  overlay.id = 'focus-guard-overlay';
  overlay.innerHTML = `
    <div class="focus-guard-content">
      <div class="focus-guard-icon">🚫</div>
      <h2>Video Blocked</h2>
      <p class="focus-guard-title">"${title}"</p>
      <p class="focus-guard-message">
        This video doesn't match your focus categories.<br>
        Stay focused on your learning goals!
      </p>
      <div class="focus-guard-stats">
        <div class="stat">
          <span class="stat-number">${stats.videosBlocked}</span>
          <span class="stat-label">Videos Blocked</span>
        </div>
        <div class="stat">
          <span class="stat-number">${stats.videosAllowed}</span>
          <span class="stat-label">Videos Allowed</span>
        </div>
      </div>
      <button id="focus-guard-back" class="focus-guard-button">
        ← Go Back to YouTube Home
      </button>
    </div>
  `;
  
  document.body.appendChild(overlay);
  
  // Add click handler for back button
  document.getElementById('focus-guard-back')?.addEventListener('click', () => {
    window.location.href = 'https://www.youtube.com';
  });
}

/**
 * Remove blocking overlay
 */
function removeBlockOverlay() {
  const overlay = document.getElementById('focus-guard-overlay');
  if (overlay) {
    overlay.remove();
  }
}

/**
 * Update statistics
 */
function updateStats(blocked) {
  if (blocked) {
    stats.videosBlocked++;
  } else {
    stats.videosAllowed++;
  }
  stats.lastUpdated = Date.now();
  
  chrome.storage.local.set({ stats });
}

/**
 * Main function to check current video
 */
function checkCurrentVideo() {
  if (!isEnabled) return;
  
  // Only run on video watch pages
  if (!window.location.pathname.includes('/watch')) {
    removeBlockOverlay();
    return;
  }
  
  const title = getVideoTitle();
  
  if (!title) {
    // Title not loaded yet, try again
    setTimeout(checkCurrentVideo, 500);
    return;
  }
  
  const allowed = isVideoAllowed(title);
  
  console.log('YouTube Focus Guard:', {
    title,
    allowed,
    timestamp: new Date().toISOString()
  });
  
  if (!allowed) {
    pauseVideo();
    showBlockOverlay(title);
    updateStats(true);
    
    // Keep pausing video if user tries to play it
    const video = getVideoPlayer();
    if (video) {
      video.addEventListener('play', pauseVideo);
    }
  } else {
    removeBlockOverlay();
    updateStats(false);
  }
}

/**
 * Monitor for navigation changes (YouTube is a SPA)
 */
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    // URL changed, check video after brief delay
    setTimeout(checkCurrentVideo, 1000);
  }
}).observe(document.body, { subtree: true, childList: true });

// Initial check when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', checkCurrentVideo);
} else {
  checkCurrentVideo();
}

// Also check when video title changes
const observer = new MutationObserver(() => {
  checkCurrentVideo();
});

// Observe the video title area for changes
const observeTitle = () => {
  const titleContainer = document.querySelector('ytd-watch-metadata');
  if (titleContainer) {
    observer.observe(titleContainer, {
      childList: true,
      subtree: true,
      characterData: true
    });
  } else {
    setTimeout(observeTitle, 1000);
  }
};

observeTitle();
