# Contributing to Lucent Cycle

Thank you for your interest in contributing! Lucent Cycle thrives with community support. Here's how you can help.

---

## 🎯 Code of Conduct

- Be respectful and inclusive
- Assume good intent
- Welcome diverse perspectives
- Report concerns to the maintainers

---

## 🚀 Getting Started

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/Lucent-Cycle.git
   cd Lucent-Cycle
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes** and test thoroughly

4. **Commit with clear messages**
   ```bash
   git commit -m "feat: add feature description"
   # or
   git commit -m "fix: resolve issue description"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request** describing what you changed and why

---

## 📋 Commit Message Convention

We follow simple commit message guidelines:

```
<type>: <description>

[optional body]
[optional footer]
```

**Types:**
- `feat:` — A new feature
- `fix:` — A bug fix
- `docs:` — Documentation changes
- `style:` — Code formatting (no logic change)
- `refactor:` — Code refactoring
- `perf:` — Performance improvements
- `test:` — Adding/updating tests
- `chore:` — Build, dependencies, etc.

**Examples:**
```
feat: add data export to CSV
fix: correct ovulation calculation for 35-day cycles
docs: update README with troubleshooting section
refactor: modularize prediction logic
```

---

## 🎨 Code Style

### JavaScript
- Use `const` by default, `let` when needed
- Use descriptive variable names
- Keep functions focused and under 50 lines where possible
- Add comments for complex logic
- Use camelCase for variables and functions

### CSS
- Use CSS custom properties (variables) for colors and spacing
- Mobile-first approach for responsive design
- Keep selectors specific but not overly nested
- Group related rules together

### HTML
- Use semantic elements (`<main>`, `<section>`, `<article>`, etc.)
- Always include `aria-label` on interactive elements without visible text
- Use `data-*` attributes for JavaScript hooks

---

## 🧪 Testing

### Before Submitting
1. **Test in multiple browsers** — Chrome, Firefox, Safari, Edge
2. **Test on mobile** — Use browser DevTools mobile view or a real device
3. **Test dark mode** — Toggle the theme and verify visuals
4. **Test keyboard navigation** — Ensure all interactive elements are reachable with Tab
5. **Test with screen readers** — NVDA (Windows) or VoiceOver (Mac)

### What to Include
- Clear description of what you tested
- Browser/device combinations tested
- Any edge cases you considered

---

## 📝 Pull Request Guidelines

When opening a PR:

1. **Title** — Clear, descriptive, follows commit convention
   ```
   feat: add data export to CSV
   fix: correct ovulation date for cycles >31 days
   ```

2. **Description** — Include:
   - What changed and why
   - How to test the change
   - Any breaking changes or new dependencies
   - Closes #123 (if addressing an issue)

3. **Checklist** — Consider including:
   ```markdown
   - [ ] Tested in Chrome, Firefox, Safari
   - [ ] Tested on mobile (iOS/Android)
   - [ ] Tested dark mode
   - [ ] Accessibility verified (keyboard nav, screen reader)
   - [ ] Updated README if needed
   - [ ] No console errors or warnings
   ```

---

## 🐛 Bug Reports

Found a bug? [Open an issue](https://github.com/K-Viola28/Lucent-Cycle/issues/new) with:

1. **Clear title** — Describe the problem concisely
2. **Steps to reproduce** — How to trigger the bug
3. **Expected behavior** — What should happen
4. **Actual behavior** — What actually happens
5. **Browser & OS** — e.g., "Chrome on macOS 14.0"
6. **Screenshot/video** — If helpful

**Example:**
```
Title: Dark mode toggle doesn't persist after page reload

Steps:
1. Click Theme button to enable dark mode
2. Refresh the page
3. Dark mode is off (should be on)

Expected: Dark mode should persist using localStorage
Actual: Dark mode reverts to light mode

Browser: Chrome 125, macOS 14.1
```

---

## 💡 Feature Requests

Have an idea? [Open an issue](https://github.com/K-Viola28/Lucent-Cycle/issues/new) with:

1. **Clear title** — Summarize the idea
2. **Problem it solves** — Why is this needed?
3. **Proposed solution** — How should it work?
4. **Alternatives** — Any other approaches?

**Example:**
```
Title: Add ability to export cycle data to CSV

Problem: Users want to back up their data and analyze it in spreadsheets

Proposed Solution:
- Add "Export Data" button in Settings
- Generate CSV with columns: date, period_start, symptoms
- Trigger browser download

Why: Privacy-first backup and external analysis capability
```

---

## 🔍 Areas for Contribution

### High Priority
- [ ] Data export/import (CSV, JSON)
- [ ] Additional test coverage
- [ ] Accessibility improvements
- [ ] Mobile-specific UI enhancements

### Medium Priority
- [ ] Internationalization (i18n) — translate to other languages
- [ ] PWA features — offline support, install prompt
- [ ] Improved prediction algorithm
- [ ] Custom symptoms

### Low Priority (Good for Learning)
- [ ] Documentation improvements
- [ ] Additional relief suggestions
- [ ] Animation polish
- [ ] Color theme options

---

## 📚 Resources

- [MDN Web Docs](https://developer.mozilla.org/) — HTML, CSS, JavaScript reference
- [Web Accessibility Guidelines](https://www.w3.org/WAI/fundamentals/) — Accessibility best practices
- [Open Source Contribution Guide](https://opensource.guide/) — General guidance

---

## ❓ Questions?

- Comment on an issue or PR
- Check existing discussions
- [Open a new discussion](https://github.com/K-Viola28/Lucent-Cycle/discussions)

---

## 🙏 Thank You

Your contributions make Lucent Cycle better for everyone. Whether it's code, documentation, bug reports, or ideas—we appreciate you!

**Happy contributing!** 💜
