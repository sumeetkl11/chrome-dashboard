import { CONFIG } from '../config.js';

export class ThemeManager {
  constructor() {
    this.currentTheme = localStorage.getItem(CONFIG.theme.storageKey) || CONFIG.theme.default;
    this.systemPreference = window.matchMedia('(prefers-color-scheme: dark)');
  }

  init() {
    // Apply saved theme or detect system preference
    if (CONFIG.theme.autoDetect && !localStorage.getItem(CONFIG.theme.storageKey)) {
      this.currentTheme = this.systemPreference.matches ? 'dark' : 'light';
    }

    this.apply();

    // Listen for system preference changes
    this.systemPreference.addEventListener('change', (e) => {
      if (CONFIG.theme.autoDetect && !localStorage.getItem(CONFIG.theme.storageKey)) {
        this.currentTheme = e.matches ? 'dark' : 'light';
        this.apply();
      }
    });
  }

  apply() {
    const html = document.documentElement;
    const oldTheme = html.getAttribute('data-theme');

    // Apply new theme
    html.setAttribute('data-theme', this.currentTheme);
    localStorage.setItem(CONFIG.theme.storageKey, this.currentTheme);

    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content',
        this.currentTheme === 'dark' ? '#0A0B10' : '#FFFFFF'
      );
    }

    // Animate transition if theme changed
    if (oldTheme && oldTheme !== this.currentTheme && !CONFIG.animation.reducedMotion) {
      html.style.transition = 'background-color 0.3s ease, color 0.3s ease';
      setTimeout(() => {
        html.style.transition = '';
      }, 300);
    }

    // Announce to screen readers
    if (CONFIG.accessibility.announceChanges) {
      this.announce(`Theme switched to ${this.currentTheme} mode`);
    }
  }

  toggle() {
    this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.apply();
    return this.currentTheme;
  }

  set(theme) {
    if (theme === 'dark' || theme === 'light') {
      this.currentTheme = theme;
      this.apply();
    }
  }

  get() {
    return this.currentTheme;
  }

  announce(message) {
    const announcer = document.getElementById('sr-announcer');
    if (announcer) {
      announcer.textContent = '';
      setTimeout(() => {
        announcer.textContent = message;
      }, 100);
    }
  }
}
