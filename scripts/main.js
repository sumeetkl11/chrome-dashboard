import Alpine from 'alpinejs';
import { DashboardState } from './state.js';
import { ThemeManager } from './features/theme.js';
import { GestureEffects } from './animations/gestures.js';
import { staggeredEntrance } from './animations/spring.js';
import { debounce } from './utils/debounce.js';
import { validateURL, validateFolderName, validateLinkName } from './utils/validators.js';
import { sanitizeURL, sanitizeLinkName, sanitizeFolderName } from './utils/sanitize.js';
import CONFIG from './config.js';

// Initialize state
const state = new DashboardState();
const themeManager = new ThemeManager();

// Alpine.js app
document.addEventListener('alpine:init', () => {
  Alpine.data('dashboard', () => ({
    // Data
    folders: [],
    searchQuery: '',
    searchResults: null,

    // Modals
    showFolderModal: false,
    newFolderName: '',
    showLinkModal: false,
    activeFolderId: null,
    newLinkName: '',
    newLinkUrl: '',
    showTokenModal: false,
    tokenInput: '',
    showSyncModal: false,
    showAnalyticsModal: false,

    // Sync
    githubToken: null,
    gistId: null,
    syncStatus: 'idle', // 'idle' | 'syncing' | 'synced' | 'error'

    // Loading states
    isLoading: false,

    // Analytics
    analytics: null,

    // Init
    async init() {
      this.isLoading = true;

      try {
        // Initialize state
        await state.init();
        this.folders = state.folders;

        // Load GitHub token and Gist ID
        this.githubToken = await state.getSetting('githubToken');
        this.gistId = await state.getSetting('gistId');

        // Initialize theme
        themeManager.init();

        // Pull from Gist if token is set
        if (this.githubToken) {
          await this.pullFromGist();
        }

        // Setup watchers
        this.$watch('searchQuery', debounce((value) => {
          this.performSearch(value);
        }, CONFIG.search.debounceDelay));

        // Modal focus helpers
        this.$watch('showFolderModal', v => {
          if (v) this.$nextTick(() => this.$refs.folderInput?.focus());
        });
        this.$watch('showLinkModal', v => {
          if (v) this.$nextTick(() => this.$refs.linkNameInput?.focus());
        });
        this.$watch('showTokenModal', v => {
          if (v) this.$nextTick(() => this.$refs.tokenInput?.focus());
        });

        // Staggered entrance animation for cards
        this.$nextTick(() => {
          const cards = document.querySelectorAll('.tilt-card');
          if (cards.length > 0) {
            staggeredEntrance(Array.from(cards), { delay: 30 });
          }
        });

      } catch (error) {
        console.error('Initialization error:', error);
        this.showError('Failed to initialize dashboard');
      } finally {
        this.isLoading = false;
      }
    },

    // Search
    performSearch(query) {
      if (!query || query.length < CONFIG.search.minQueryLength) {
        this.searchResults = null;
        return;
      }

      const results = state.search(query);
      this.searchResults = results;
    },

    get filteredFolders() {
      if (!this.searchResults) {
        return this.folders;
      }

      // Group search results by folder
      const folderMap = new Map();

      this.searchResults.forEach(result => {
        const { folderId, folderName } = result.item;
        if (!folderMap.has(folderId)) {
          const folder = this.folders.find(f => f.id === folderId);
          if (folder) {
            folderMap.set(folderId, {
              ...folder,
              links: []
            });
          }
        }

        const folder = folderMap.get(folderId);
        if (folder) {
          folder.links.push(result.item);
        }
      });

      return Array.from(folderMap.values());
    },

    // Folder CRUD
    async addFolder() {
      const name = this.newFolderName.trim();

      if (!validateFolderName(name)) {
        this.showError('Folder name must be between 1 and 50 characters');
        return;
      }

      try {
        const folder = await state.addFolder(name);
        this.folders = state.folders;
        this.newFolderName = '';
        this.showFolderModal = false;

        GestureEffects.celebrate(this.$el);
        this.showSuccess('Folder created!');

        // Sync
        await this.save();
      } catch (error) {
        console.error('Add folder error:', error);
        this.showError('Failed to create folder');
      }
    },

    async deleteFolder(id) {
      const folder = this.folders.find(f => f.id === id);
      if (!folder) return;

      if (!confirm(`Delete "${folder.name}" and all its ${folder.links.length} links?`)) {
        return;
      }

      try {
        await state.deleteFolder(id);
        this.folders = state.folders;
        this.showSuccess('Folder deleted');
        await this.save();
      } catch (error) {
        console.error('Delete folder error:', error);
        this.showError('Failed to delete folder');
      }
    },

    // Link CRUD
    openAddLink(folderId) {
      this.activeFolderId = folderId;
      this.newLinkName = '';
      this.newLinkUrl = '';
      this.showLinkModal = true;
    },

    async addLink() {
      const name = this.newLinkName.trim();
      const url = this.newLinkUrl.trim();

      if (!validateLinkName(name)) {
        this.showError('Link name must be between 1 and 100 characters');
        return;
      }

      const sanitizedUrl = sanitizeURL(url);
      if (!sanitizedUrl) {
        this.showError('Invalid URL');
        return;
      }

      try {
        await state.addLink(this.activeFolderId, name, sanitizedUrl);
        this.folders = state.folders;
        this.showLinkModal = false;

        GestureEffects.celebrate(this.$el);
        this.showSuccess('Link added!');

        await this.save();
      } catch (error) {
        console.error('Add link error:', error);
        this.showError('Failed to add link');
      }
    },

    async deleteLink(folderId, linkId) {
      try {
        await state.deleteLink(folderId, linkId);
        this.folders = state.folders;
        this.showSuccess('Link deleted');
        await this.save();
      } catch (error) {
        console.error('Delete link error:', error);
        this.showError('Failed to delete link');
      }
    },

    // Save (sync to Gist if enabled)
    async save() {
      if (this.githubToken) {
        await this.pushToGist();
      }
    },

    // GitHub Gist sync
    async pushToGist() {
      this.syncStatus = 'syncing';
      const content = JSON.stringify(this.folders, null, 2);
      const headers = {
        'Authorization': `token ${this.githubToken}`,
        'Content-Type': 'application/json'
      };

      try {
        if (this.gistId) {
          // Update existing gist
          const res = await fetch(`https://api.github.com/gists/${this.gistId}`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({
              files: {
                'dashboard-links.json': { content }
              }
            })
          });

          if (!res.ok) throw new Error('Gist update failed');
        } else {
          // Create new gist
          const res = await fetch('https://api.github.com/gists', {
            method: 'POST',
            headers,
            body: JSON.stringify({
              description: 'My Dashboard Links — auto-synced',
              public: false,
              files: {
                'dashboard-links.json': { content }
              }
            })
          });

          if (!res.ok) throw new Error('Gist creation failed');

          const data = await res.json();
          this.gistId = data.id;
          await state.setSetting('gistId', this.gistId);
        }

        this.syncStatus = 'synced';
        setTimeout(() => {
          if (this.syncStatus === 'synced') this.syncStatus = 'idle';
        }, 3000);
      } catch (e) {
        console.error('Push to Gist error:', e);
        this.syncStatus = 'error';
        setTimeout(() => { this.syncStatus = 'idle'; }, 4000);
        this.showError('Sync failed');
      }
    },

    async pullFromGist() {
      if (!this.githubToken) return;

      this.syncStatus = 'syncing';
      const headers = { 'Authorization': `token ${this.githubToken}` };

      try {
        let gistData;

        if (this.gistId) {
          const res = await fetch(`https://api.github.com/gists/${this.gistId}`, { headers });
          if (!res.ok) throw new Error('Gist fetch failed');
          gistData = await res.json();
        } else {
          // Search for our gist
          const res = await fetch('https://api.github.com/gists?per_page=100', { headers });
          if (!res.ok) throw new Error('Gist list failed');
          const list = await res.json();
          const found = list.find(g => g.files['dashboard-links.json']);

          if (!found) {
            // First time — push current local data
            await this.pushToGist();
            return;
          }

          this.gistId = found.id;
          await state.setSetting('gistId', this.gistId);

          const r2 = await fetch(`https://api.github.com/gists/${this.gistId}`, { headers });
          if (!r2.ok) throw new Error('Gist fetch failed');
          gistData = await r2.json();
        }

        const content = gistData.files['dashboard-links.json'].content;
        const parsed = JSON.parse(content);

        // Update IndexedDB
        const tx = state.db.transaction('folders', 'readwrite');
        await tx.store.clear();
        for (const folder of parsed) {
          await tx.store.put(folder);
        }
        await tx.done;

        await state.loadFolders();
        this.folders = state.folders;

        this.syncStatus = 'synced';
        setTimeout(() => {
          if (this.syncStatus === 'synced') this.syncStatus = 'idle';
        }, 3000);
      } catch (e) {
        console.error('Pull from Gist error:', e);
        this.syncStatus = 'error';
        setTimeout(() => { this.syncStatus = 'idle'; }, 4000);
        this.showError('Sync failed');
      }
    },

    async saveToken() {
      const token = this.tokenInput.trim();

      if (!token) {
        this.showError('Token is required');
        return;
      }

      this.githubToken = token;
      await state.setSetting('githubToken', token);
      this.tokenInput = '';
      this.showTokenModal = false;

      this.showSuccess('Token saved!');
      await this.pullFromGist();
    },

    async clearToken() {
      this.githubToken = null;
      this.gistId = null;
      await state.deleteSetting('githubToken');
      await state.deleteSetting('gistId');
      this.syncStatus = 'idle';
      this.showSuccess('Disconnected from GitHub');
    },

    // Theme
    toggleTheme() {
      const newTheme = themeManager.toggle();
      this.showSuccess(`Switched to ${newTheme} mode`);
    },

    // Helpers
    getFavicon(url) {
      try {
        const { hostname } = new URL(url);
        return `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;
      } catch {
        return '';
      }
    },

    getHostname(url) {
      try {
        return new URL(url).hostname;
      } catch {
        return url;
      }
    },

    // Track link click
    async handleLinkClick(linkId) {
      try {
        await state.trackLinkClick(linkId);
      } catch (error) {
        console.error('Track click error:', error);
      }
    },

    // 3D Tilt effect (reduced intensity)
    handleMouseMove(e) {
      if (CONFIG.animation.reducedMotion) return;

      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const rotateX = (((e.clientY - rect.top) / rect.height) - 0.5) * -15; // Reduced from -30
      const rotateY = (((e.clientX - rect.left) / rect.width) - 0.5) * 15;  // Reduced from 30

      card.style.transform = `perspective(1000px) scale3d(1.02,1.02,1.02) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    },

    handleMouseLeave(e) {
      e.currentTarget.style.transform = 'perspective(1000px) scale3d(1,1,1) rotateX(0deg) rotateY(0deg)';
    },

    // Notifications
    showSuccess(message) {
      this.announce(message);
      console.log('✅', message);
    },

    showError(message) {
      this.announce(message);
      console.error('❌', message);

      // Shake the container
      const container = this.$el;
      if (container) {
        GestureEffects.shake(container);
      }
    },

    announce(message) {
      const announcer = document.getElementById('sr-announcer');
      if (announcer) {
        announcer.textContent = '';
        setTimeout(() => {
          announcer.textContent = message;
        }, 100);
      }
    },

    // Close all modals
    closeAllModals() {
      this.showFolderModal = false;
      this.showLinkModal = false;
      this.showTokenModal = false;
      this.showSyncModal = false;
      this.showAnalyticsModal = false;
    }
  }));
});

// Start Alpine
Alpine.start();

// Log initialization
console.log('🚀 Advanced Dashboard initialized');
console.log('📊 Features:', Object.keys(CONFIG.features).filter(k => CONFIG.features[k]));
