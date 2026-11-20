# Contributing to Chrome Dashboard

First off, thank you for considering contributing to Chrome Dashboard! 🎉

## Code of Conduct

This project and everyone participating in it is governed by our commitment to providing a welcoming and inclusive environment. Please be respectful and constructive in all interactions.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the behavior
- **Expected behavior** vs actual behavior
- **Screenshots** if applicable
- **Browser version** and OS
- **Console errors** if any

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title and description**
- **Use case** - why is this enhancement useful?
- **Proposed solution** - how would you implement it?
- **Alternatives considered**

### Pull Requests

1. **Fork the repo** and create your branch from `ready` or `main`
2. **Follow existing code style** - run linters if available
3. **Test your changes** thoroughly in multiple browsers
4. **Update documentation** if needed
5. **Write clear commit messages**
6. **Include screenshots** for UI changes

#### Pull Request Process

1. Update the README.md with details of changes if applicable
2. Ensure all tests pass and code follows the project style
3. The PR will be merged once you have approval from maintainers

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/chrome-dashboard.git
cd chrome-dashboard

# Install dependencies
npm install

# Start development server
npm run dev

# Run build
npm run build
```

## Coding Standards

### JavaScript
- Use ES6+ features
- Follow modular architecture
- Add JSDoc comments for functions
- Use meaningful variable names
- Keep functions small and focused

### CSS
- Use CSS custom properties for theming
- Follow BEM-like naming conventions
- Mobile-first responsive design
- Test in both light and dark themes

### Accessibility
- All interactive elements must be keyboard accessible
- Include proper ARIA labels
- Maintain color contrast ratios (WCAG AAA)
- Test with screen readers

### Performance
- Lazy load when possible
- Debounce/throttle event handlers
- Optimize animations for 60fps
- Keep bundle size minimal

## Project Structure

```
scripts/
├── animations/    # Animation system
├── features/      # Feature modules (modals, search, etc.)
└── utils/         # Utility functions

styles/
├── components/    # Component-specific styles
├── themes/        # Theme definitions
└── variables.css  # CSS custom properties
```

## Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters
- Reference issues and pull requests after the first line

Examples:
```
Add fuzzy search functionality

Implement Fuse.js integration for better search results.
Includes highlighting and scoring.

Closes #123
```

## Testing Checklist

Before submitting a PR, verify:

- [ ] Code works in Chrome, Firefox, and Safari
- [ ] Responsive design works on mobile
- [ ] Both light and dark themes work correctly
- [ ] Keyboard navigation works
- [ ] No console errors
- [ ] Performance hasn't degraded
- [ ] Accessibility features still work

## Questions?

Feel free to open an issue with your question or reach out to maintainers.

Thank you for contributing! 🙌
