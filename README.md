# 🛒 RedHideIt — Notebook & IDE Disguise for Reddit

<p align="center">
  <img src="icons/icon128.png" width="96" height="96" alt="RedHideIt Logo" />
</p>

<p align="center">
  <b>Disguise your Reddit browsing as an authentic Kaggle or Classic Jupyter Notebook data analysis workspace.</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Manifest-V3-brightgreen" alt="Manifest V3" />
  <img src="https://img.shields.io/badge/Firefox_AMO-Compliant-orange" alt="AMO Compliant" />
  <img src="https://img.shields.io/badge/Browsers-Chrome%20%7C%20Firefox%20%7C%20Edge%20%7C%20Brave-blue" alt="Browser Compatibility" />
  <img src="https://img.shields.io/badge/License-MIT-purple" alt="License MIT" />
</p>

---

## 🎯 What is RedHideIt?

**RedHideIt** transforms your Reddit feeds, discussions, and media into pixel-perfect, fully interactive data science IDE environments. Whether you are at work, in class, or in a coffee shop, your browsing looks like serious Python data science, machine learning research, and exploratory data analysis.

Switch seamlessly between:
1. **📊 Kaggle Notebook Skin** — Modern Kaggle IDE interface with full-width toolbar, floating run states, and dataset side drawer.
2. **🪐 Classic Jupyter Notebook Skin** — Authentic Jupyter 6.x notebook environment with the classic 3-tier header, Pygments syntax highlighting, and authentic `In [ n ]:` / `Out[ n ]:` execution prompts.

---

## ✨ Features

### 🪐 Authentic Classic Jupyter Notebook Skin
- **Classic 3-Tier Jupyter Header**: Includes the 38px Jupyter logo bar with notebook renaming (`r_<subreddit>_analysis.ipynb`), the 28px standard menu bar (`File`, `Edit`, `View`, `Insert`, `Cell`, `Kernel`, `Widgets`, `Help`), and the 34px action toolbar (`Save`, `+`, `Cut`, `Copy`, `Paste`, `Up/Down`, `Run`, `Interrupt`, `Restart`).
- **Standard Prompt Formatting**: Authentic classic prompt column with `In [ n ]:` and `Out[ n ]:` indicators.
- **Pygments Code Highlighting**: True-to-life Jupyter syntax theme (`.rj-kw` green `#008000`, `.rj-str` red `#ba2121`, `.rj-func` blue `#0000ff`, `.rj-var` `#000000`).
- **Responsive Notebook Sheet**: Centered notebook container with proper line wrapping and zero horizontal overflow.

### 📊 1:1 Kaggle Notebook Skin
- **Full Kaggle IDE Clone**: Top header (`Draft saved`, `Share`, `Save Version 0`), menu bars, action toolbars, and docked 380px right-hand dataset drawer.
- **Dynamic Dataset Modal**: Search any subreddit live and switch data inputs without leaving the page.

### ⚡ Universal Capabilities (All Skins)
- **⚡ Keyboard Execution (`Shift + Enter` / `Ctrl + Enter`)**: Press `Shift + Enter` on any cell to execute thread analysis, fetch live Reddit comments, and advance to the next cell.
- **🎬 Rich Media & Video Support**: Native player for Reddit DASH videos (`v.redd.it`), YouTube iframe embeds, Streamable, Gifs, Imgur, and text post previews.
- **🔄 Instant Skin Switcher**: Switch between Jupyter and Kaggle skins instantly via the top-bar dropdown; your choice is automatically saved to `localStorage`.
- **⤓ Batch Pagination**: Click `fetch_next_batch(25)` or `df.tail(25)` at the bottom of the notebook to stream the next batch of posts seamlessly.
- **✏️ Dynamic Cells**: Add, edit, run, reorder (▲ / ▼), and delete custom Python code and Markdown documentation cells.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| **`Shift + Enter`** | Run active cell (fetch comments / media) and advance to the next cell |
| **`Ctrl + Enter`** / **`Cmd + Enter`** | Run active cell in-place |
| **Click on Cell** | Select active cell |
| **Click `📂 r/subreddit` badge** | Quick-switch directly to that subreddit's dataset feed |

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
5. Open [old.reddit.com](https://old.reddit.com) or [reddit.com](https://www.reddit.com) to see your disguised notebook interface!

### Option 2: Load in Firefox (Temporary Add-on / AMO)

1. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on...**.
3. Select `manifest.json` from the project directory.

---

## 🏗️ Modular Architecture

```
RedHideit/
├── manifest.json              # Manifest V3 extension configuration (Chrome & Firefox AMO compliant)
├── content.js                 # Router & skin orchestrator (window.switchSkin)
├── style.css                  # Shared media & base typography styles
│
├── utils/
│   ├── icons.js               # Centralized SVG icon set (Jupyter, Kaggle, toolbar icons)
│   └── dom.js                 # DOM helper utilities & security sanitizers
│
├── core/
│   ├── state.js               # Reactive global state (active feed, tokens, theme, activeSkin)
│   ├── api.js                 # Reddit JSON API client & DOM scraping
│   └── media.js               # Safe video & media resolution (v.redd.it, YouTube, Gifs)
│
└── skins/
    ├── base.js                # BaseSkin interface & skin contract
    ├── kaggle/
    │   └── kaggle.js          # KaggleSkin implementation (Header, Toolbars, Modal, Cells)
    └── jupyter/
        ├── jupyter.js         # JupyterSkin implementation (3-tier header, In/Out prompts, comments)
        └── jupyter.css        # Classic Jupyter Notebook styles & Pygments code theme
```

---

## 🛣️ Roadmap

- [x] 1:1 Kaggle Notebook Skin
- [x] Classic Jupyter Notebook Skin
- [x] Instant Skin Switcher (persisted via `localStorage`)
- [x] Multi-format video players (`v.redd.it`, YouTube, Streamable)
- [x] Subreddit dataset search modal
- [x] `Shift + Enter` execution engine
- [x] Firefox AMO Manifest V3 validation (0 errors, 0 warnings)
- [ ] **VS Code / Monaco IDE Skin**
- [ ] Extension popup menu for instant skin switching & quick panic toggle button

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
