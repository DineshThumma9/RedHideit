# 🛒 RedHideIt — Notebook & IDE Disguise for Reddit

<p align="center">
  <img src="icons/icon128.png" width="96" height="96" alt="RedHideIt Logo" />
</p>

<p align="center">
  <b>Disguise your Reddit browsing as an authentic Kaggle Jupyter Notebook data analysis workspace.</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Manifest-V3-brightgreen" alt="Manifest V3" />
  <img src="https://img.shields.io/badge/Browsers-Chrome%20%7C%20Firefox%20%7C%20Edge%20%7C%20Brave-blue" alt="Browser Compatibility" />
  <img src="https://img.shields.io/badge/License-MIT-orange" alt="License MIT" />
</p>

---

## 🎯 What is RedHideIt?

**RedHideIt** transforms your Reddit feeds and discussions into a pixel-perfect **1:1 Kaggle Jupyter Notebook environment**. Whether you're at work, school, or in a coffee shop, your browsing looks like serious Python data science and machine learning research.

---

## ✨ Features

- **📊 1:1 Kaggle Interface**: Includes full-width top header (`Draft saved`, `Share`, `Save Version 0`), menu bars, action toolbars, and docked 380px right-hand dataset drawer.
- **⚡ Keyboard Execution (`Shift + Enter` / `Ctrl + Enter`)**: Press `Shift + Enter` on any cell to execute thread analysis, fetch live Reddit comments, and smoothly advance to the next cell.
- **🎬 Rich Media & Video Support**: Native player for Reddit DASH videos (`v.redd.it`), YouTube iframe embeds, Streamable, Gifs, Imgur, and text post previews.
- **🔍 Subreddit Search & Dataset Switcher**: Click `+ Add Input` or the Datasets tab to open the dataset search modal, search any subreddit in real-time, and dynamically switch feeds.
- **⤓ Batch Pagination**: Click `fetch_next_batch(25)` at the bottom of the notebook to append the next batch of posts seamlessly.
- **✏️ Dynamic Cells**: Add, edit, run, reorder (▲ / ▼), and delete custom Python code and Markdown documentation cells.
- **🧩 Pluggable Architecture**: Modular skin system designed for future **JupyterLab** and **VS Code / Monaco** themes.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| **`Shift + Enter`** | Run active cell (fetch comments / media) and advance to the next cell |
| **`Ctrl + Enter`** / **`Cmd + Enter`** | Run active cell in-place |
| **Click on Cell** | Select active cell (highlights with Kaggle blue border) |
| **Click `📂 r/subreddit` badge** | Quick-switch directly to that subreddit's feed |

---

## 🚀 Installation

### Option 1: Load in Chrome / Brave / Edge (Developer Mode)

1. Clone or download this repository:
   ```bash
   git clone https://github.com/DineshThumma9/RedHideit.git
   ```
2. Open your browser and navigate to `chrome://extensions` (or `brave://extensions` / `edge://extensions`).
3. Enable **Developer mode** in the top-right corner.
4. Click **Load unpacked** and select the `RedHideit` folder.
5. Open [old.reddit.com](https://old.reddit.com) or [reddit.com](https://www.reddit.com) to see the Kaggle notebook interface live!

### Option 2: Load in Firefox (Temporary Add-on)

1. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on...**.
3. Select `manifest.json` from the project directory.

---

## 🏗️ Modular Project Architecture

```
RedHideit/
├── manifest.json              # Manifest V3 extension configuration
├── style.css                  # Kaggle design system tokens, themes, & media styles
├── content.js                 # Main router & active skin orchestrator
│
├── utils/
│   ├── icons.js               # Centralized SVG icon set
│   └── dom.js                 # DOM helper utilities (escapeHtml, sanitize)
│
├── core/
│   ├── state.js               # Reactive global state (active feed, tokens, theme)
│   ├── api.js                 # Reddit JSON API client & DOM scraping
│   └── media.js               # Video & media resolution (v.redd.it, YouTube, Gifs)
│
└── skins/
    ├── base.js                # BaseSkin interface & future skin stubs
    └── kaggle/
        └── kaggle.js          # KaggleSkin implementation (Header, Toolbars, Modal, Cells)
```

---

## 🛣️ Roadmap

- [x] 1:1 Kaggle Notebook UI
- [x] Multi-format video players (`v.redd.it`, YouTube, Streamable)
- [x] Subreddit dataset search modal
- [x] `Shift + Enter` execution engine
- [x] Modular skin architecture
- [ ] **JupyterLab Skin**
- [ ] **VS Code / Monaco IDE Skin**
- [ ] Extension popup menu for instant skin switching & toggle panic button

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
