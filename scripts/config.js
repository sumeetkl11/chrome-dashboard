export const CONFIG = {
  // Animation settings
  animation: {
    duration: {
      fast: 200,
      normal: 300,
      slow: 500
    },
    spring: {
      stiffness: 180,
      damping: 12,
      mass: 1
    },
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
  },

  // Theme settings
  theme: {
    default: 'dark',
    storageKey: 'dashboard-theme',
    autoDetect: true
  },

  // Sync settings
  sync: {
    autoSyncInterval: 300000, // 5 minutes
    retryAttempts: 3,
    retryDelay: 2000
  },

  // Link health check
  linkHealth: {
    checkInterval: 86400000, // 24 hours
    timeout: 5000,
    enabled: true
  },

  // Search settings
  search: {
    debounceDelay: 300,
    minQueryLength: 2,
    maxResults: 50
  },

  // Performance
  performance: {
    enableVirtualization: false, // Enable for 100+ links
    lazyLoadImages: true,
    prefetchLinks: false
  },

  // Accessibility
  accessibility: {
    announceChanges: true,
    keyboardShortcuts: true,
    focusVisible: true
  },

  // Feature flags
  features: {
    commandPalette: true,
    dragDrop: true,
    analytics: true,
    linkHealth: true,
    offlineMode: true
  }
};

// Adjust for reduced motion preference
if (CONFIG.animation.reducedMotion) {
  CONFIG.animation.duration.fast = 0;
  CONFIG.animation.duration.normal = 0;
  CONFIG.animation.duration.slow = 0;
}

// Adjust for connection speed
if ('connection' in navigator) {
  const conn = navigator.connection;
  if (conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g') {
    CONFIG.performance.lazyLoadImages = true;
    CONFIG.performance.prefetchLinks = false;
    CONFIG.linkHealth.enabled = false;
  }
}

export default CONFIG;
