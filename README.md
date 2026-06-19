<div align="center">

# 🌙 Lucent Cycle

A calming, aesthetic cycle-tracking app designed for clarity, comfort, and insight.

[![View Live Site](https://img.shields.io/badge/View%20Live%20Site-C084FC?style=for-the-badge&logo=vercel&logoColor=white)](https://k-viola28.github.io/Lucent-Cycle/)
[![License: MIT](https://img.shields.io/badge/License-MIT-C084FC?style=for-the-badge)](LICENSE)
[![Built with Vanilla JS](https://img.shields.io/badge/Vanilla%20JS-C084FC?style=for-the-badge&logo=javascript&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

</div>

---

## ✨ About

**Lucent Cycle** is a minimal, privacy-first cycle tracker that helps you understand your rhythm with gentle visuals and intuitive tracking. All data stays local on your device—no accounts, no tracking, no servers.

Whether you're tracking for wellness insights, planning ahead, or understanding your body's patterns, Lucent Cycle offers a supportive, judgment-free space to log and reflect.

---

## 🌸 Features

- **🌙 Cycle Tracking** — Mark period start dates and watch predictions fill in automatically
- **📅 Smart Calendar** — Visual month view showing periods, ovulation, and fertile windows
- **💜 Symptom Logging** — Daily check-ins for cramps, headaches, mood, fatigue, and more
- **🔮 Predictions** — Estimated ovulation and next period based on your cycle
- **📊 Insights** — Discover patterns over time (most common symptoms, cycle length trends)
- **🧘 Relief Guide** — Phase-specific suggestions for movement and nourishment
- **🌓 Dark Mode** — Easy on the eyes, day or night
- **📱 Fully Responsive** — Works beautifully on phone, tablet, or desktop
- **🔒 100% Private** — All data stored locally in your browser; no servers, no tracking

---

## 🚀 Quick Start

### View Online
Visit [Lucent Cycle live](https://k-viola28.github.io/Lucent-Cycle/) — no installation needed.

### Local Setup
1. Clone this repository:
   ```bash
   git clone https://github.com/K-Viola28/Lucent-Cycle.git
   cd Lucent-Cycle
   ```

2. Open `index.html` in your browser:
   ```bash
   # macOS/Linux
   open index.html
   
   # Windows
   start index.html
   
   # Or just drag & drop into your browser
   ```

3. Or use a simple local server:
   ```bash
   # Python 3
   python3 -m http.server 8000
   
   # Node.js (requires http-server: npm install -g http-server)
   http-server
   ```

---

## 📖 How to Use

### Cycle Tracking
1. **Mark a Period Start** → Tap a date on the calendar to record the first day of your period
2. **View Predictions** → Ovulation, fertile window, and next period are calculated automatically
3. **Adjust Settings** → Go to the Settings panel to customize your cycle length and period length

### Symptom Logging
1. **Select a Date** → Use the date picker in the Symptom Tracker section
2. **Choose Symptoms** → Tap one or more symptoms (cramps, headache, mood, fatigue)
3. **Save** → Click "Save daily log"
4. **Review** → Your recent logs appear below and feed into pattern insights

### Understanding Your Data
- **Overview Panel** → At-a-glance stats: next period, ovulation date, fertile window, average cycle length
- **Calendar View** → Color-coded days show periods (red), fertile window (green), ovulation (purple), and predictions (light purple)
- **Insights Panel** → Discover how many cycles you've logged, average period length, and most common symptoms
- **Relief Guide** → Get phase-specific suggestions for exercise and nutrition based on where you are in your cycle

### Phases & Suggestions
Lucent Cycle recognizes four cycle phases and offers tailored guidance:
- **Menstrual** — Rest, gentle movement, iron-rich foods
- **Follicular** — Rising energy, strength training, balanced meals
- **Ovulation** — Peak energy, active workouts, fiber and hydration
- **Luteal** — Wind-down, restorative movement, complex carbs and calcium

---

## 🛠️ Built With

- **HTML5** — Semantic markup with accessibility in mind
- **CSS3** — Glass-morphism design with smooth animations
- **Vanilla JavaScript** — No dependencies, lightweight and fast

---

## 📁 Project Structure

```
Lucent-Cycle/
├── index.html         # Main HTML structure
├── styles.css         # Design, layout, dark mode theme
├── script.js          # Core logic (state, predictions, rendering)
├── README.md          # This file
├── LICENSE            # MIT License
├── PRIVACY.md         # Privacy & data handling
├── CONTRIBUTING.md    # Contribution guidelines
├── CHANGELOG.md       # Version history
└── .gitignore         # Git ignore rules
```

---

## 💾 Data & Storage

### How Your Data is Stored
- **All data lives locally** in your browser's `localStorage`
- No information is sent to servers, tracked, or shared
- Data persists across browser sessions until you clear it

### What We Store
- Period start dates
- Symptom logs (date + symptoms)
- Your settings (cycle length, period length, theme preference, reminder preference)

### Data Safety Tips
- **Backup your data** → Use Settings → "Clear all data" warning to export manually if needed
- **Browser sync** → If you use browser sync across devices, your Lucent Cycle data may sync too
- **Clear cache** → Clearing your browser cache will delete your data
- **Export regularly** → Feature coming soon to export your data as JSON/CSV

> **Not Medical Advice:** Lucent Cycle is a personal tracking tool and not a substitute for medical advice. Always consult a healthcare provider for cycle-related concerns.

---

## 🔒 Privacy

Lucent Cycle respects your privacy completely:
- ✅ **No accounts** — No login required
- ✅ **No tracking** — No analytics, pixels, or external requests
- ✅ **No ads** — Ad-free experience
- ✅ **No data collection** — Nothing is sent anywhere
- ✅ **Open source** — Code is transparent and auditable

See [PRIVACY.md](PRIVACY.md) for comprehensive details about how your data is handled.

---

## 🎨 Customization

### Changing the Theme
Toggle dark/light mode with the Theme button in the header. Your preference is automatically saved.

### Adjusting Your Cycle
Go to Settings and update:
- **Average cycle length** (typically 20–45 days; default: 28)
- **Period length** (typically 2–10 days; default: 5)

### Enable Reminders
Toggle "Enable local reminder note" to get browser notifications about your upcoming period. Your browser will ask for permission to send notifications.

---

## 🐛 Troubleshooting

**Q: My data disappeared!**  
A: Check if you cleared your browser's cache or cookies (this also clears `localStorage`). Consider backing up by exporting data once export features are available.

**Q: Predictions seem off.**  
A: Make sure your cycle length is accurate. Predictions improve the more data you log—track at least 2–3 full cycles for better accuracy.

**Q: Dark mode isn't working.**  
A: Refresh the page or try toggling the theme button again. The preference is saved in settings.

**Q: Can I sync across devices?**  
A: Not yet. Lucent Cycle data is stored locally for privacy. We're exploring secure end-to-end encrypted sync options.

**Q: Is my data really private?**  
A: Yes! All data stays in your browser. You can verify this by checking your browser's Developer Tools → Application → Local Storage. See [PRIVACY.md](PRIVACY.md) for full details.

---

## 🤝 Contributing

We welcome contributions! Whether you're interested in fixing bugs, adding features, improving documentation, or suggesting ideas, we'd love your help.

**Getting Started:**
1. Fork this repository
2. Create a feature branch (`git checkout -b feature/your-idea`)
3. Make your changes and test thoroughly
4. Commit with clear messages (`git commit -m "feat: add export to CSV"`)
5. Push to your fork (`git push origin feature/your-idea`)
6. Open a Pull Request with a description of your changes

**See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines, code style, and testing checklist.**

### Ideas for Contributions
- Export/import data (CSV, JSON)
- Cross-device sync (end-to-end encrypted)
- Additional symptom types or custom symptoms
- Cycle phase notifications
- Improved prediction algorithms
- Additional languages (internationalization)
- Mobile app wrapper
- PWA features (offline support, install prompt)
- Accessibility improvements
- Additional UI themes

---

## 🗺️ Roadmap

### Planned Features
- [ ] Data export/import (CSV, JSON) — **High Priority**
- [ ] Web notifications for predictions
- [ ] Custom symptoms
- [ ] Improved prediction model
- [ ] Multiple profiles
- [ ] Internationalization (i18n)
- [ ] PWA features (offline support, install prompt)
- [ ] Cross-device sync (encrypted)
- [ ] Additional UI themes

See [CHANGELOG.md](CHANGELOG.md) for version history and releases.

---

## 📜 License

This project is licensed under the [MIT License](LICENSE) — feel free to use, modify, and distribute.

---

## ❓ Questions & Support

- **Found a bug?** → [Open an issue](https://github.com/K-Viola28/Lucent-Cycle/issues)
- **Have a feature idea?** → [Start a discussion](https://github.com/K-Viola28/Lucent-Cycle/discussions) or [open an issue](https://github.com/K-Viola28/Lucent-Cycle/issues)
- **Privacy concerns?** → See [PRIVACY.md](PRIVACY.md) or open an issue
- **Want to contribute?** → Check [CONTRIBUTING.md](CONTRIBUTING.md)

---

<div align="center">

**Made with 💜 for your wellness and autonomy.**

*Your data, your device, your privacy.*

</div>
