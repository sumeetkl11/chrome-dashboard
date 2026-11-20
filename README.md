# Chrome Dashboard 🚀

A modern, accessible Chrome extension dashboard for organizing your favorite links with advanced features like GitHub sync, analytics, and smooth animations.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-green.svg)](https://chrome.google.com/webstore)

## ✨ Features

### Core Functionality
- 📁 **Smart Organization** - Create folders and organize links intuitively
- 🔍 **Fuzzy Search** - Find anything instantly with intelligent search
- ☁️ **Cloud Sync** - Sync your links across devices via GitHub Gist
- 🌓 **Theme Support** - Beautiful light and dark themes with auto-detection
- 📱 **Responsive Design** - Works perfectly on all screen sizes

### Advanced Features
- 💾 **Offline-First** - IndexedDB storage for reliable offline access
- 📊 **Analytics** - Track link clicks and usage patterns
- 🎨 **Smooth Animations** - Spring physics and gesture feedback
- ♿ **Accessibility** - WCAG AAA compliant with full keyboard navigation
- 🔒 **Secure** - Input sanitization and secure token storage

## 🚀 Quick Start

### Installation

#### For Chrome Extension:
1. Clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the project folder

#### For Web Development:
```bash
# Clone the repository
git clone https://github.com/sumeetkl11/chrome-dashboard.git
cd chrome-dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📖 Usage

### Basic Operations
1. **Create Folders** - Click "+ New Folder" to organize your links
2. **Add Links** - Click "+ Add Link" within any folder
3. **Search** - Use `Ctrl/Cmd + F` or click the search bar
4. **Toggle Theme** - Click the sun/moon icon

### GitHub Sync Setup
1. Click "☁️ Setup Sync"
2. Generate a GitHub Personal Access Token:
   - Visit [GitHub Token Settings](https://github.com/settings/tokens)
   - Create new token (classic)
   - Enable only the "gist" scope
3. Paste token and connect

### Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + F` | Focus search |
| `Esc` | Close modals |
| `Tab` | Navigate elements |
| `Enter` | Submit forms |

## 🏗️ Project Structure

```
chrome-dashboard/
├── index.html              # Main dashboard entry
├── enhanced.html           # Enhanced UI variant
├── ultra.html             # Ultra modern variant
├── dashboard.html         # Alternative layout
├── manifest.json          # Chrome extension manifest
├── package.json           # Dependencies
├── vite.config.js         # Build configuration
├── scripts/
│   ├── main.js           # App initialization
│   ├── state.js          # State management
│   ├── config.js         # Configuration
│   ├── animations/       # Animation system
│   ├── features/         # Feature modules
│   └── utils/            # Utility functions
└── styles/
    ├── variables.css     # CSS custom properties
    ├── base.css         # Base styles
    ├── themes/          # Theme definitions
    └── components/      # Component styles
```

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **State Management**: Alpine.js with IndexedDB
- **Search**: Fuse.js for fuzzy search
- **Animations**: Custom spring physics + Web Animations API
- **Build Tool**: Vite
- **Storage**: IndexedDB (offline-first)
- **Sync**: GitHub Gist API

## 🌐 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- iOS Safari 14+
- Android Chrome 90+

## 🔒 Security

- XSS protection via input sanitization
- URL validation (only http/https allowed)
- Secure token storage in IndexedDB
- GitHub tokens never synced to cloud

## ♿ Accessibility

Full WCAG AAA compliance:
- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ High contrast mode
- ✅ Reduced motion support
- ✅ Focus indicators (7:1 contrast ratio)
- ✅ ARIA labels and semantic HTML

Tested with NVDA, VoiceOver, and TalkBack.

## 📊 Performance

- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Lighthouse Score: 95+
- Bundle Size: ~180KB (gzipped)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Design inspired by modern glassmorphic UI
- Fonts: Inter and Outfit (Google Fonts)
- Libraries: Alpine.js, Fuse.js, idb, canvas-confetti
- Icons: Native emoji and Google favicons

## 📧 Support

For issues, questions, or feature requests, please open an issue on GitHub.

---

**Built with ❤️ using Claude Code**

⭐ Star this repo if you find it useful!
