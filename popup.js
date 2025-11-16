// YouTube Focus Guard - Popup Script

document.addEventListener('DOMContentLoaded', () => {
  const toggleEnabled = document.getElementById('toggleEnabled');
  const statusBadge = document.getElementById('statusBadge');
  const blockedCount = document.getElementById('blockedCount');
  const allowedCount = document.getElementById('allowedCount');
  const resetStats = document.getElementById('resetStats');
  
  // Load current state
  chrome.storage.local.get(['enabled', 'stats'], (result) => {
    const enabled = result.enabled !== false;
    toggleEnabled.checked = enabled;
    updateStatusBadge(enabled);
    
    if (result.stats) {
      blockedCount.textContent = result.stats.videosBlocked || 0;
      allowedCount.textContent = result.stats.videosAllowed || 0;
    }
  });
  
  // Toggle enabled/disabled
  toggleEnabled.addEventListener('change', (e) => {
    const enabled = e.target.checked;
    chrome.storage.local.set({ enabled });
    updateStatusBadge(enabled);
    
    // Show feedback
    showNotification(enabled ? 'Extension activated! 🎯' : 'Extension paused 💤');
  });
  
  // Reset statistics
  resetStats.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all statistics?')) {
      const newStats = {
        videosBlocked: 0,
        videosAllowed: 0,
        lastUpdated: Date.now()
      };
      
      chrome.storage.local.set({ stats: newStats }, () => {
        blockedCount.textContent = '0';
        allowedCount.textContent = '0';
        showNotification('Statistics reset! ✨');
      });
    }
  });
  
  // Update status badge
  function updateStatusBadge(enabled) {
    if (enabled) {
      statusBadge.textContent = 'Active';
      statusBadge.classList.remove('inactive');
    } else {
      statusBadge.textContent = 'Paused';
      statusBadge.classList.add('inactive');
    }
  }
  
  // Show notification (simple feedback)
  function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: #48bb78;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      z-index: 1000;
      animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  }
  
  // Add animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
});
