import { openDB } from 'idb';
import Fuse from 'fuse.js';
import { sanitizeFolderName, sanitizeLinkName } from './utils/sanitize.js';

const DB_NAME = 'DashboardDB';
const DB_VERSION = 1;

export class DashboardState {
  constructor() {
    this.db = null;
    this.fuse = null;
    this.folders = [];
  }

  async init() {
    // Open IndexedDB
    this.db = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Folders store
        if (!db.objectStoreNames.contains('folders')) {
          const folderStore = db.createObjectStore('folders', { keyPath: 'id' });
          folderStore.createIndex('name', 'name', { unique: false });
        }

        // Analytics store
        if (!db.objectStoreNames.contains('analytics')) {
          const analyticsStore = db.createObjectStore('analytics', { keyPath: 'linkId' });
          analyticsStore.createIndex('clicks', 'clicks', { unique: false });
          analyticsStore.createIndex('lastClicked', 'lastClicked', { unique: false });
        }

        // Settings store
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      }
    });

    // Migrate from localStorage if needed
    await this.migrateFromLocalStorage();

    // Load folders
    await this.loadFolders();

    console.log('✅ DashboardState initialized');
  }

  // Migrate from localStorage to IndexedDB
  async migrateFromLocalStorage() {
    const oldData = localStorage.getItem('myDashboardData');
    if (oldData) {
      try {
        const folders = JSON.parse(oldData);
        const tx = this.db.transaction('folders', 'readwrite');

        for (const folder of folders) {
          await tx.store.put(folder);
        }

        await tx.done;
        localStorage.removeItem('myDashboardData');
        console.log('✅ Migrated data from localStorage to IndexedDB');
      } catch (e) {
        console.error('❌ Migration failed:', e);
      }
    }

    // Migrate GitHub token
    const oldToken = localStorage.getItem('dashboardGithubToken');
    if (oldToken) {
      await this.db.put('settings', { key: 'githubToken', value: oldToken });
      localStorage.removeItem('dashboardGithubToken');
    }

    // Migrate Gist ID
    const oldGistId = localStorage.getItem('dashboardGistId');
    if (oldGistId) {
      await this.db.put('settings', { key: 'gistId', value: oldGistId });
      localStorage.removeItem('dashboardGistId');
    }
  }

  async loadFolders() {
    this.folders = await this.db.getAll('folders');

    // If no folders, create defaults
    if (this.folders.length === 0) {
      this.folders = this.getDefaultFolders();
      const tx = this.db.transaction('folders', 'readwrite');
      for (const folder of this.folders) {
        await tx.store.put(folder);
      }
      await tx.done;
    }

    // Setup search
    this.setupSearch(this.folders);

    return this.folders;
  }

  // Folder CRUD
  async getFolder(id) {
    return await this.db.get('folders', id);
  }

  async saveFolder(folder) {
    await this.db.put('folders', folder);
    await this.loadFolders(); // Refresh and update search
  }

  async deleteFolder(id) {
    await this.db.delete('folders', id);
    await this.loadFolders();
  }

  async addFolder(name) {
    const folder = {
      id: `f_${Date.now()}`,
      name: sanitizeFolderName(name),
      links: [],
      createdAt: Date.now()
    };
    await this.saveFolder(folder);
    return folder;
  }

  // Link CRUD
  async addLink(folderId, name, url) {
    const folder = await this.getFolder(folderId);
    if (!folder) throw new Error('Folder not found');

    const link = {
      id: `l_${Date.now()}`,
      name: sanitizeLinkName(name),
      url,
      createdAt: Date.now()
    };

    folder.links.push(link);
    await this.saveFolder(folder);
    return link;
  }

  async deleteLink(folderId, linkId) {
    const folder = await this.getFolder(folderId);
    if (!folder) throw new Error('Folder not found');

    folder.links = folder.links.filter(l => l.id !== linkId);
    await this.saveFolder(folder);

    // Delete analytics for this link
    await this.db.delete('analytics', linkId);
  }

  async moveLink(linkId, fromFolderId, toFolderId) {
    const fromFolder = await this.getFolder(fromFolderId);
    const toFolder = await this.getFolder(toFolderId);

    if (!fromFolder || !toFolder) throw new Error('Folder not found');

    const linkIndex = fromFolder.links.findIndex(l => l.id === linkId);
    if (linkIndex === -1) throw new Error('Link not found');

    const [link] = fromFolder.links.splice(linkIndex, 1);
    toFolder.links.push(link);

    await this.saveFolder(fromFolder);
    await this.saveFolder(toFolder);

    return link;
  }

  // Search with Fuse.js
  setupSearch(folders) {
    const searchData = folders.flatMap(folder =>
      folder.links.map(link => ({
        ...link,
        folderName: folder.name,
        folderId: folder.id
      }))
    );

    this.fuse = new Fuse(searchData, {
      keys: [
        { name: 'name', weight: 2 },
        { name: 'url', weight: 1 },
        { name: 'folderName', weight: 1.5 }
      ],
      threshold: 0.3,
      includeScore: true,
      includeMatches: true
    });
  }

  search(query) {
    if (!query.trim() || !this.fuse) return null;
    return this.fuse.search(query);
  }

  // Analytics tracking
  async trackLinkClick(linkId) {
    const analytics = (await this.db.get('analytics', linkId)) || {
      linkId,
      clicks: 0,
      lastClicked: null,
      clickHistory: []
    };

    analytics.clicks++;
    analytics.lastClicked = Date.now();
    analytics.clickHistory.push(Date.now());

    // Keep only last 100 clicks
    if (analytics.clickHistory.length > 100) {
      analytics.clickHistory = analytics.clickHistory.slice(-100);
    }

    await this.db.put('analytics', analytics);
  }

  async getTopLinks(limit = 5) {
    const allAnalytics = await this.db.getAll('analytics');
    return allAnalytics
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, limit);
  }

  async getLinkAnalytics(linkId) {
    return await this.db.get('analytics', linkId);
  }

  // Settings
  async getSetting(key) {
    const setting = await this.db.get('settings', key);
    return setting?.value;
  }

  async setSetting(key, value) {
    await this.db.put('settings', { key, value });
  }

  async deleteSetting(key) {
    await this.db.delete('settings', key);
  }

  // Export/Import
  async exportData() {
    const folders = await this.db.getAll('folders');
    const analytics = await this.db.getAll('analytics');
    const settings = await this.db.getAll('settings');

    return {
      version: DB_VERSION,
      exportedAt: Date.now(),
      folders,
      analytics,
      settings: settings.filter(s => s.key !== 'githubToken') // Don't export token
    };
  }

  async importData(data) {
    if (!data.folders) throw new Error('Invalid data format');

    const tx = this.db.transaction(['folders', 'analytics', 'settings'], 'readwrite');

    // Clear existing data
    await tx.objectStore('folders').clear();
    await tx.objectStore('analytics').clear();

    // Import folders
    for (const folder of data.folders) {
      await tx.objectStore('folders').put(folder);
    }

    // Import analytics
    if (data.analytics) {
      for (const analytics of data.analytics) {
        await tx.objectStore('analytics').put(analytics);
      }
    }

    // Import settings (except token)
    if (data.settings) {
      for (const setting of data.settings) {
        if (setting.key !== 'githubToken') {
          await tx.objectStore('settings').put(setting);
        }
      }
    }

    await tx.done;
    await this.loadFolders();
  }

  // Default folders
  getDefaultFolders() {
    return [
      {
        id: "f_1",
        name: "AI Tools",
        createdAt: Date.now(),
        links: [
          { id: "l_1", name: "Claude", url: "https://claude.ai", createdAt: Date.now() },
          { id: "l_2", name: "ChatGPT", url: "https://chatgpt.com", createdAt: Date.now() },
          { id: "l_3", name: "Bard/Gemini", url: "https://gemini.google.com", createdAt: Date.now() },
          { id: "l_4", name: "Deepseek", url: "https://chat.deepseek.com", createdAt: Date.now() },
          { id: "l_5", name: "Stitch", url: "https://stitch.withgoogle.com", createdAt: Date.now() }
        ]
      },
      {
        id: "f_2",
        name: "Dev/Hosting",
        createdAt: Date.now(),
        links: [
          { id: "l_6", name: "GitHub", url: "https://github.com", createdAt: Date.now() },
          { id: "l_7", name: "Vercel", url: "https://vercel.com", createdAt: Date.now() },
          { id: "l_8", name: "Render", url: "https://render.com", createdAt: Date.now() },
          { id: "l_9", name: "Railway", url: "https://railway.app", createdAt: Date.now() },
          { id: "l_10", name: "Supabase", url: "https://supabase.com", createdAt: Date.now() },
          { id: "l_11", name: "Koyeb", url: "https://koyeb.com", createdAt: Date.now() },
          { id: "l_12", name: "MongoDB Atlas", url: "https://mongodb.com/atlas", createdAt: Date.now() }
        ]
      },
      {
        id: "f_3",
        name: "Design",
        createdAt: Date.now(),
        links: [
          { id: "l_13", name: "Figma", url: "https://figma.com", createdAt: Date.now() },
          { id: "l_14", name: "v0.dev", url: "https://v0.dev", createdAt: Date.now() },
          { id: "l_15", name: "Canva", url: "https://canva.com", createdAt: Date.now() },
          { id: "l_16", name: "Excalidraw", url: "https://excalidraw.com", createdAt: Date.now() }
        ]
      },
      {
        id: "f_4",
        name: "Job Hunt",
        createdAt: Date.now(),
        links: [
          { id: "l_17", name: "Rozee.pk", url: "https://rozee.pk", createdAt: Date.now() },
          { id: "l_18", name: "LinkedIn", url: "https://linkedin.com", createdAt: Date.now() },
          { id: "l_19", name: "Indeed", url: "https://indeed.com", createdAt: Date.now() }
        ]
      },
      {
        id: "f_5",
        name: "Learning/ML",
        createdAt: Date.now(),
        links: [
          { id: "l_20", name: "Google Colab", url: "https://colab.research.google.com", createdAt: Date.now() },
          { id: "l_21", name: "Kaggle", url: "https://kaggle.com", createdAt: Date.now() },
          { id: "l_22", name: "Hugging Face", url: "https://huggingface.co", createdAt: Date.now() }
        ]
      },
      {
        id: "f_6",
        name: "Utility",
        createdAt: Date.now(),
        links: [
          { id: "l_23", name: "Notion", url: "https://notion.so", createdAt: Date.now() },
          { id: "l_24", name: "Regex101", url: "https://regex101.com", createdAt: Date.now() },
          { id: "l_25", name: "CodeSandbox", url: "https://codesandbox.io", createdAt: Date.now() },
          { id: "l_26", name: "YT Music", url: "https://music.youtube.com", createdAt: Date.now() },
          { id: "l_27", name: "YouTube", url: "https://youtube.com", createdAt: Date.now() },
          { id: "l_28", name: "Outlook", url: "https://outlook.cloud.microsoft/mail/", createdAt: Date.now() }
        ]
      },
      {
        id: "f_7",
        name: "imp",
        createdAt: Date.now(),
        links: [
          { id: "l_29", name: "meta ads roadmap", url: "https://gemini.google.com/spark/chat/cdae37a8dac668ef", createdAt: Date.now() },
          { id: "l_30", name: "Meta business", url: "https://business.facebook.com/", createdAt: Date.now() }
        ]
      },
      {
        id: "f_8",
        name: "3d",
        createdAt: Date.now(),
        links: [
          { id: "l_31", name: "whisk", url: "https://labs.google/fx/tools/whisk", createdAt: Date.now() },
          { id: "l_32", name: "flow", url: "https://labs.google/fx/tools/flow", createdAt: Date.now() }
        ]
      },
      {
        id: "f_9",
        name: "google course",
        createdAt: Date.now(),
        links: [
          { id: "l_33", name: "Google AI Fun...", url: "https://www.coursera.org/learn/google-ai-fundamentals/lecture/lkxJu/ai-fundamentals", createdAt: Date.now() },
          { id: "l_34", name: "Python-crash", url: "https://www.coursera.org/learn/python-crash-course/home/module/1", createdAt: Date.now() },
          { id: "l_35", name: "e-commerce a...", url: "https://www.coursera.org/learn/foundations-of-digital-marketing-and-e-commerce/home/module/1", createdAt: Date.now() },
          { id: "l_36", name: "AI Essentials", url: "https://www.coursera.org/learn/google-introduction-to-ai/home/module/1", createdAt: Date.now() }
        ]
      }
    ];
  }
}
