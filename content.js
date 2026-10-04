// ===== REDDIT JUPY - content.js (Kaggle 1:1 exact clone) =====

const isOldReddit  = location.hostname === 'old.reddit.com';
const commentOffsets = {};

if (document.readyState === 'complete') {
  init();
} else {
  window.addEventListener('load', init);
}

function init() {
  if (isOldReddit) {
    const posts = readOldRedditPosts();
    if (!posts.length) return;
    buildNotebook(posts);
  }
}

// ─── READ POSTS ──────────────────────────────────────────
function readOldRedditPosts() {
  const things = document.querySelectorAll('.thing.link');
  const posts  = [];
  things.forEach((el, i) => {
    const titleEl = el.querySelector('p.title > a.title');
    posts.push({
      index:     i + 1,
      postId:    el.getAttribute('data-fullname')?.replace('t3_', '') || `post_${i}`,
      title:     titleEl?.textContent?.trim() || 'Untitled',
      author:    el.getAttribute('data-author')    || 'unknown',
      subreddit: el.getAttribute('data-subreddit') || 'all',
      score:     el.getAttribute('data-score')     || '0',
      url:       el.getAttribute('data-url')       || '',
      permalink: el.getAttribute('data-permalink') || '',
      domain:    el.getAttribute('data-domain')    || '',
    });
  });
  return posts;
}

// ─── SVG ICONS ───────────────────────────────────────────
const ICONS = {
  hamburger: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>`,
  plus:      `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>`,
  cut:       `<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M9.64 7.64c.23-.5.36-1.05.36-1.64 0-2.21-1.79-4-4-4S2 3.79 2 6s1.79 4 4 4c.59 0 1.14-.13 1.64-.36L10 12l-2.36 2.36C7.14 14.13 6.59 14 6 14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4c0-.59-.13-1.14-.36-1.64L12 14l7 7h3v-1L9.64 7.64zM6 8c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm0 12c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm6-7.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zM19 3l-6 6 2 2 7-7V3z"/></svg>`,
  copy:      `<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>`,
  paste:     `<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M19 2h-4.18C14.4.84 13.3 0 12 0c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm7 18H5V4h2v3h10V4h2v16z"/></svg>`,
  arrowUp:   `<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/></svg>`,
  arrowDown: `<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/></svg>`,
  play:      `<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`,
  share:     `<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/></svg>`,
  more:      `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>`,
  folder:    `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>`,
  chevron:   `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/></svg>`,
  chevronUp: `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/></svg>`,
  upload:    `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/></svg>`,
  settings:  `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>`,
  notebook:  `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-8L4 8v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2zm0 18H6V9h5V4h7v16z"/></svg>`,
  file:      `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>`,
  power:     `<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z"/></svg>`,
  refresh:   `<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>`,
};

// ─── BUILD NOTEBOOK ──────────────────────────────────────
function buildNotebook(posts) {
  const sub      = posts[0]?.subreddit || 'all';
  const notebook = document.createElement('div');
  notebook.id    = 'rj-notebook';

  notebook.innerHTML = `
    <!-- KAGGLE LEFT NAV BAR -->
    <nav id="rj-leftnav">
      <button class="rj-nav-icon active" title="Menu">${ICONS.hamburger}</button>
      <div class="rj-nav-spacer"></div>
      <button class="rj-nav-icon" title="Create" style="background:#20beff; color:#ffffff; border-radius:50%; width:32px; height:32px;">
        ${ICONS.plus}
      </button>
      <button class="rj-nav-icon" title="Home">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
      </button>
      <button class="rj-nav-icon" title="Competitions">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
      </button>
      <button class="rj-nav-icon" title="Datasets">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20 6h-2.18c.07-.44.18-.88.18-1.36C18 2.05 15.96 0 13.36 0c-1.46 0-2.75.67-3.63 1.72L9 3 7.27 1.72C6.39.67 5.1 0 3.64 0 1.04 0-1 2.05-1 4.64c0 .48.11.92.18 1.36H-2v2h22V6zm-9.5-.14c.53-.66 1.32-1.1 2.22-1.1 1.58 0 2.86 1.28 2.86 2.86 0 .31-.07.59-.16.86h-6.14l1.22-2.62zM3.64 5.5c-.31 0-.59-.07-.86-.16V4.64c0-1.58 1.28-2.86 2.86-2.86.9 0 1.69.44 2.22 1.1l1.22 2.62H3.64zM2 8h20v13H2z"/></svg>
      </button>
      <button class="rj-nav-icon rj-nav-active" title="Code">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>
      </button>
      <button class="rj-nav-icon" title="Discuss">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>
      </button>
    </nav>

    <!-- MAIN WRAPPER -->
    <div id="rj-content-wrap">

      <!-- ROW 1: TOP HEADER (Title + Draft saved on Left, Share + Save Version on Right) -->
      <div id="rj-top-header">
        <div id="rj-title-group">
          <span id="rj-nb-icon">🛒</span>
          <span id="rj-nb-title">r/${escapeHtml(sub)}: Reddit Analysis &amp; Data Pipeline</span>
          <span id="rj-nb-draft">Draft saved</span>
        </div>
        <div id="rj-top-header-right">
          <button class="rj-share-btn">${ICONS.share} Share</button>
          <button class="rj-save-btn" id="rj-theme-toggle" title="Save Version & toggle themes">
            Save Version <span class="rj-ver-badge">0</span>
          </button>
        </div>
      </div>

      <!-- ROW 2: MENU BAR (Directly below Title row) -->
      <div id="rj-menubar-row">
        <nav id="rj-menubar">
          <span class="rj-menu-item">File</span>
          <span class="rj-menu-item">Edit</span>
          <span class="rj-menu-item">View</span>
          <span class="rj-menu-item">Run</span>
          <span class="rj-menu-item">Settings</span>
          <span class="rj-menu-item">Add-ons</span>
          <span class="rj-menu-item">Help</span>
        </nav>
      </div>

      <!-- ROW 3: ACTION TOOLBAR -->
      <div id="rj-action-toolbar">
        <div id="rj-tb-left">
          <button class="rj-tb-btn" title="Add code cell">${ICONS.plus}</button>
          <button class="rj-tb-btn rj-tb-caret-btn" title="More add options">▾</button>
          <div class="rj-tb-sep"></div>
          <button class="rj-tb-btn" title="Cut">${ICONS.cut}</button>
          <button class="rj-tb-btn" title="Copy">${ICONS.copy}</button>
          <button class="rj-tb-btn" title="Paste">${ICONS.paste}</button>
          <div class="rj-tb-sep"></div>
          <button class="rj-tb-btn" id="rj-tb-run-first" title="Run cell">${ICONS.play}</button>
          <button class="rj-tb-runall" id="rj-tb-run-all" title="Run all cells">▶▶ Run All</button>
          <div class="rj-tb-sep"></div>
          <!-- Plain bold text dropdown (no box border) -->
          <span class="rj-tb-dropdown-plain">Markdown ▾</span>
        </div>

        <div id="rj-tb-right">
          <div class="rj-session-status">
            <span class="rj-session-dot" id="rj-status-dot"></span>
            <span id="rj-session-label">Draft Session off (run a cell to start)</span>
          </div>
          <div class="rj-tb-icon-group">
            <button class="rj-tb-btn" id="rj-btn-power" title="Power off">${ICONS.power}</button>
            <button class="rj-tb-btn" id="rj-btn-refresh" title="Restart kernel">${ICONS.refresh}</button>
            <button class="rj-tb-btn" title="More options">${ICONS.more}</button>
            <button class="rj-tb-btn" id="rj-nb-toggle-btn" title="Toggle Notebook panel">${ICONS.notebook}</button>
          </div>
        </div>
      </div>

      <!-- MAIN NOTEBOOK AREA (End-to-End full width towards left) -->
      <div id="rj-main">
        <div id="rj-cells">
          
          <!-- Environment Setup Code Cell (Exact Kaggle initial setup cell) -->
          <div class="rj-cell-wrapper" id="rj-cell-setup">
            <div class="rj-row">
              <div class="rj-gutter">
                <button class="rj-run-btn" title="Run cell">▶</button>
                <span class="rj-gutter-num">[ 1]:</span>
              </div>
              <div class="rj-cell-box">
                <div class="rj-code-cell">
                  <span class="rj-code-comment"># This Python 3 environment comes with many helpful analytics libraries installed</span>
                  <span class="rj-code-comment"># It is defined by the kaggle/python Docker image: https://github.com/kaggle/docker-python</span>
                  <span class="rj-code-comment"># For example, here's several helpful packages to load</span>
                  <span class="rj-code-blank"></span>
                  <span class="rj-code-line"><span class="rj-kw">import</span> <span class="rj-var">numpy</span> <span class="rj-kw">as</span> <span class="rj-var">np</span> <span class="rj-code-comment"># linear algebra</span></span>
                  <span class="rj-code-line"><span class="rj-kw">import</span> <span class="rj-var">pandas</span> <span class="rj-kw">as</span> <span class="rj-var">pd</span> <span class="rj-code-comment"># data processing, CSV file I/O (e.g. pd.read_csv)</span></span>
                  <span class="rj-code-blank"></span>
                  <span class="rj-code-comment"># Input data files are available in the read-only "../input/" directory</span>
                  <span class="rj-code-comment"># For example, running this (by clicking run or pressing Shift+Enter) will list all files under the input directory</span>
                  <span class="rj-code-blank"></span>
                  <span class="rj-code-line"><span class="rj-kw">import</span> <span class="rj-var">os</span></span>
                  <span class="rj-code-line"><span class="rj-kw">for</span> <span class="rj-var">dirname</span>, <span class="rj-var">_</span>, <span class="rj-var">filenames</span> <span class="rj-kw">in</span> <span class="rj-var">os</span>.<span class="rj-func">walk</span>(<span class="rj-str">'/kaggle/input'</span>):</span>
                  <span class="rj-code-line">    <span class="rj-kw">for</span> <span class="rj-var">filename</span> <span class="rj-kw">in</span> <span class="rj-var">filenames</span>:</span>
                  <span class="rj-code-line">        <span class="rj-func">print</span>(<span class="rj-var">os</span>.<span class="rj-var">path</span>.<span class="rj-func">join</span>(<span class="rj-var">dirname</span>, <span class="rj-var">filename</span>))</span>
                </div>
                <div class="rj-cell-actions">
                  <button class="rj-cell-nav">▲</button>
                  <button class="rj-cell-nav">▼</button>
                  <button class="rj-cell-more">⋮</button>
                </div>
              </div>
            </div>
            <div class="rj-cell-bottom-bar">
              <button class="rj-btn-pill">+ Code</button>
              <button class="rj-btn-pill">+ Markdown</button>
            </div>
          </div>

        </div>
      </div>

      <!-- RIGHT PANEL (Kaggle Drawer 1:1) -->
      <aside id="rj-notebook-panel">
        <div id="rj-panel-header">
          <span id="rj-panel-title">Notebook</span>
          <button id="rj-panel-close" title="Close">✕</button>
        </div>

        <div class="rj-panel-content">
          <!-- Input section -->
          <div class="rj-panel-section">
            <div class="rj-ps-header" data-section="input">
              <span>Input</span>
              <span class="rj-ps-chevron">${ICONS.chevronUp}</span>
            </div>
            <div class="rj-ps-body" id="rj-ps-input">
              <div class="rj-ps-btns">
                <button class="rj-ps-btn">${ICONS.plus} Add Input</button>
                <button class="rj-ps-btn">${ICONS.upload} Upload</button>
              </div>
              <div class="rj-ps-datasets-label">DATASETS</div>
              <div class="rj-ps-dataset-card">
                <div class="rj-ps-dataset-header">
                  <span class="rj-ps-dataset-title">👥 r/${escapeHtml(sub)}_dataset</span>
                  <span class="rj-ps-dataset-size">1.4 MB</span>
                </div>
                <div class="rj-ps-file-list">
                  <div class="rj-ps-file-item">📊 ${escapeHtml(sub)}_posts (${posts.length} rows).csv</div>
                  <div class="rj-ps-file-item">📄 raw_comments.json</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Output section -->
          <div class="rj-panel-section">
            <div class="rj-ps-header" data-section="output">
              <span>Output</span>
              <span class="rj-ps-chevron">${ICONS.chevronUp}</span>
            </div>
            <div class="rj-ps-body" id="rj-ps-output">
              <div class="rj-ps-output-box">
                <div class="rj-ps-output-row">
                  <span class="rj-ps-folder">📁 /kaggle/working</span>
                  <button class="rj-ps-icon-btn">${ICONS.settings}</button>
                </div>
                <div class="rj-ps-file-list">
                  <div class="rj-ps-file-item">📄 submission.csv</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Table of contents -->
          <div class="rj-panel-section">
            <div class="rj-ps-header" data-section="toc">
              <span>Table of contents</span>
              <span class="rj-ps-chevron">${ICONS.chevronUp}</span>
            </div>
            <div class="rj-ps-body" id="rj-ps-toc">
              <div id="rj-toc-list"></div>
            </div>
          </div>

          <!-- Session options -->
          <div class="rj-panel-section">
            <div class="rj-ps-header" data-section="session">
              <span>Session options</span>
              <span class="rj-ps-chevron">${ICONS.chevron}</span>
            </div>
            <div class="rj-ps-body" id="rj-ps-session" style="display:none">
              <div class="rj-ps-session-list">
                <div class="rj-ps-session-item">
                  <span class="rj-ps-session-label">Accelerator</span>
                  <span class="rj-ps-session-val">GPU T4 x2 ▾</span>
                </div>
                <div class="rj-ps-session-item">
                  <span class="rj-ps-session-label">Language</span>
                  <span class="rj-ps-session-val">Python 3.10.12</span>
                </div>
                <div class="rj-ps-session-item">
                  <span class="rj-ps-session-label">Internet</span>
                  <span class="rj-ps-session-val" style="color:#34d399">ON</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Schedule -->
          <div class="rj-panel-section">
            <div class="rj-ps-header" data-section="schedule">
              <span>Schedule a notebook to run</span>
              <span class="rj-ps-chevron">${ICONS.chevron}</span>
            </div>
            <div class="rj-ps-body" id="rj-ps-schedule" style="display:none"></div>
          </div>
        </div>

      </aside>

      <!-- Right edge toggle tab button -->
      <button id="rj-panel-tab" class="panel-open" title="Toggle Notebook panel">▶</button>

    </div><!-- end rj-content-wrap -->
  `;

  // Build cells
  const cellsEl = notebook.querySelector('#rj-cells');
  const tocList = notebook.querySelector('#rj-toc-list');

  // Initial TOC item
  const tocSetup = document.createElement('div');
  tocSetup.className = 'rj-toc-item active';
  tocSetup.innerHTML = `<span class="rj-toc-badge">⚡</span> <span>Environment Setup</span>`;
  tocSetup.addEventListener('click', () => {
    document.getElementById('rj-cell-setup')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
  tocList.appendChild(tocSetup);

  posts.forEach((post, i) => {
    // 1. Markdown cell for post presentation
    const mdWrapper = buildMarkdownCell(post, i + 1);
    cellsEl.appendChild(mdWrapper);

    // 2. Python Code cell for data extraction & comment execution
    const codeWrapper = buildCodeCell(post, i + 2);
    cellsEl.appendChild(codeWrapper);

    // TOC Entry
    const ti = document.createElement('div');
    ti.className = 'rj-toc-item';
    ti.id = `rj-toc-item-${post.postId}`;
    ti.innerHTML = `<span class="rj-toc-badge">🛒</span> <span>${escapeHtml(post.title.slice(0, 36))}${post.title.length > 36 ? '…' : ''}</span>`;
    ti.addEventListener('click', () => {
      const cellEl = document.getElementById(`rj-md-cell-${post.postId}`);
      if (cellEl) {
        cellEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      notebook.querySelectorAll('.rj-toc-item').forEach(el => el.classList.remove('active'));
      ti.classList.add('active');
    });
    tocList.appendChild(ti);
  });

  // Panel toggle
  const panel    = notebook.querySelector('#rj-notebook-panel');
  const tab      = notebook.querySelector('#rj-panel-tab');
  const closeBtn = notebook.querySelector('#rj-panel-close');
  const tbToggle = notebook.querySelector('#rj-nb-toggle-btn');

  function togglePanel() {
    const isOpen = panel.classList.toggle('open');
    tab.classList.toggle('panel-open', isOpen);
    tab.innerHTML = isOpen ? '▶' : '◀';
  }

  // Open panel by default
  panel.classList.add('open');
  tab.classList.add('panel-open');
  tab.innerHTML = '▶';

  tab.addEventListener('click', togglePanel);
  closeBtn.addEventListener('click', togglePanel);
  tbToggle.addEventListener('click', togglePanel);

  // Collapsible panel sections
  notebook.querySelectorAll('.rj-ps-header').forEach(hdr => {
    hdr.addEventListener('click', () => {
      const sectionId = hdr.dataset.section;
      const body = document.getElementById(`rj-ps-${sectionId}`);
      if (!body) return;
      const isHidden = body.style.display === 'none';
      body.style.display = isHidden ? 'block' : 'none';
      hdr.querySelector('.rj-ps-chevron').innerHTML =
        isHidden ? ICONS.chevronUp : ICONS.chevron;
    });
  });

  // Theme toggle on Save Version button
  notebook.querySelector('#rj-theme-toggle').addEventListener('click', toggleTheme);

  // Run all button
  notebook.querySelector('#rj-tb-run-all')?.addEventListener('click', () => {
    posts.slice(0, 5).forEach((p, idx) => {
      setTimeout(() => handleRun(p), idx * 600);
    });
  });

  // Run first cell
  notebook.querySelector('#rj-tb-run-first')?.addEventListener('click', () => {
    if (posts[0]) handleRun(posts[0]);
  });

  // Power & refresh handlers
  notebook.querySelector('#rj-btn-refresh')?.addEventListener('click', () => {
    document.getElementById('rj-session-label').textContent = 'Kernel restarting…';
    document.getElementById('rj-status-dot').classList.remove('active');
    setTimeout(() => {
      document.getElementById('rj-session-label').textContent = 'Draft Session Active (Kernel ready)';
      document.getElementById('rj-status-dot').classList.add('active');
    }, 1000);
  });

  notebook.querySelector('#rj-btn-power')?.addEventListener('click', () => {
    document.getElementById('rj-session-label').textContent = 'Draft Session off (run a cell to start)';
    document.getElementById('rj-status-dot').classList.remove('active');
  });

  document.body.appendChild(notebook);
}

// ─── THEME TOGGLE ────────────────────────────────────────
let currentTheme = 'dark';
function toggleTheme() {
  const themes = ['dark', 'kaggle'];
  const idx = themes.indexOf(currentTheme);
  currentTheme = themes[(idx + 1) % themes.length];
  document.documentElement.setAttribute('data-theme', currentTheme);
  const label = currentTheme === 'dark' ? '0' : 'Light';
  document.querySelector('#rj-theme-toggle').innerHTML =
    `Save Version <span class="rj-ver-badge">${label}</span>`;
}

// ─── BUILD MARKDOWN CELL (Post Presentation) ─────────────
function buildMarkdownCell(post, cellIndex) {
  const wrapper = document.createElement('div');
  wrapper.className = 'rj-cell-wrapper';
  wrapper.id = `rj-md-cell-${post.postId}`;

  const safeScore = Number(post.score || 0).toLocaleString();

  wrapper.innerHTML = `
    <div class="rj-row">
      <div class="rj-gutter"></div>
      <div class="rj-markdown-cell">
        <h1 class="rj-md-h1">🛒 ${escapeHtml(post.title)}</h1>
        <h2 class="rj-md-h2">🎯 Objective &amp; Data Pipeline Analysis</h2>
        <p class="rj-md-desc">
          In this session, we analyze community thread dynamics, sentiment patterns, and user responses from <b>r/${escapeHtml(post.subreddit)}</b>.
        </p>
        <div class="rj-md-meta-badges">
          <span class="rj-md-badge">👤 <b>u/${escapeHtml(post.author)}</b></span>
          <span class="rj-md-badge">▲ <b>${safeScore} upvotes</b></span>
          <span class="rj-md-badge">🌐 ${escapeHtml(post.domain || 'self')}</span>
        </div>
      </div>
    </div>
    <div class="rj-cell-bottom-bar">
      <button class="rj-btn-pill">+ Code</button>
      <button class="rj-btn-pill">+ Markdown</button>
    </div>
  `;
  return wrapper;
}

// ─── BUILD CODE CELL (Executable Thread Extraction) ──────
function buildCodeCell(post, cellIndex) {
  const wrapper = document.createElement('div');
  wrapper.className = 'rj-cell-wrapper';
  wrapper.id = `rj-cell-${post.postId}`;

  wrapper.innerHTML = `
    <!-- INPUT ROW -->
    <div class="rj-row rj-input-row">
      <div class="rj-gutter">
        <button class="rj-run-btn" title="Run cell">▶</button>
        <span class="rj-gutter-num">[ ${cellIndex}]:</span>
      </div>
      <div class="rj-cell-box">
        <div class="rj-code-cell">
          <span class="rj-code-line"><span class="rj-kw">import</span> <span class="rj-var">pandas</span> <span class="rj-kw">as</span> <span class="rj-var">pd</span></span>
          <span class="rj-code-line"><span class="rj-kw">import</span> <span class="rj-var">requests</span></span>
          <span class="rj-code-blank"></span>
          <span class="rj-code-comment"># Extract thread responses and comments JSON</span>
          <span class="rj-code-line"><span class="rj-var">thread_id</span> <span class="rj-op">=</span> <span class="rj-str">"${post.postId}"</span></span>
          <span class="rj-code-line"><span class="rj-var">comments_df</span> <span class="rj-op">=</span> <span class="rj-var">pd</span>.<span class="rj-func">read_json</span>(<span class="rj-str">f"https://old.reddit.com${post.permalink}.json"</span>)</span>
          <span class="rj-code-line"><span class="rj-func">print</span>(<span class="rj-str">f"Loaded discussions for thread: {thread_id}"</span>)</span>
        </div>
        <div class="rj-cell-actions">
          <button class="rj-cell-nav" title="Move up">▲</button>
          <button class="rj-cell-nav" title="Move down">▼</button>
          <button class="rj-cell-more" title="More">⋮</button>
        </div>
      </div>
    </div>

    <!-- HOVER BUTTONS UNDER CELL -->
    <div class="rj-cell-bottom-bar">
      <button class="rj-btn-pill">+ Code</button>
      <button class="rj-btn-pill">+ Markdown</button>
    </div>

    <!-- OUTPUT ROW (hidden until Run) -->
    <div class="rj-row rj-output-row" id="rj-output-${post.postId}" style="display:none">
      <div class="rj-gutter rj-out-gutter">
        <span class="rj-gutter-num rj-out-num">[ ${cellIndex}]:</span>
      </div>
      <div class="rj-output-box">
        <div class="rj-media-wrap" id="rj-media-${post.postId}"></div>
        <div class="rj-comments" id="rj-comments-${post.postId}"></div>
      </div>
    </div>
  `;

  wrapper.querySelector('.rj-run-btn').addEventListener('click', () => handleRun(post, cellIndex));
  return wrapper;
}

// ─── HANDLE RUN ──────────────────────────────────────────
async function handleRun(post, cellIndex = 1) {
  const outputRow  = document.getElementById(`rj-output-${post.postId}`);
  const mediaEl    = document.getElementById(`rj-media-${post.postId}`);
  const commentsEl = document.getElementById(`rj-comments-${post.postId}`);
  const wrapper    = document.getElementById(`rj-cell-${post.postId}`);
  const btn        = wrapper?.querySelector('.rj-run-btn');
  const numEl      = wrapper?.querySelector('.rj-gutter-num');

  if (!outputRow) return;

  outputRow.style.display = 'flex';
  wrapper.classList.add('ran');
  if (numEl) numEl.textContent = `[ *]:`;
  
  document.getElementById('rj-session-label').textContent = 'Draft Session Active (Kernel running)';
  document.getElementById('rj-status-dot').classList.add('active');

  if (!commentOffsets[post.postId]) {
    commentOffsets[post.postId] = 0;
    renderMedia(post, mediaEl);
  }

  if (btn) {
    btn.innerHTML = '<span class="rj-spinner"></span>';
    btn.disabled  = true;
  }

  try {
    const offset   = commentOffsets[post.postId];
    const comments = await fetchComments(post, offset);

    commentsEl.querySelector('.rj-load-more')?.remove();

    if (!comments.length) {
      if (offset === 0) {
        commentsEl.innerHTML = `<div class="rj-no-more">── no comments found ──</div>`;
      } else {
        commentsEl.innerHTML += `<div class="rj-no-more">── end of thread ──</div>`;
      }
      if (numEl) numEl.textContent = `[ ${cellIndex}]:`;
      if (btn) { btn.innerHTML = '▶'; btn.disabled = false; }
      document.getElementById('rj-session-label').textContent = 'Draft Session Active (Kernel ready)';
      return;
    }

    comments.forEach(c => {
      const div = document.createElement('div');
      div.className = 'rj-comment';
      div.innerHTML = `
        <div class="rj-c-author">u/${escapeHtml(c.author)} <span class="rj-c-score">▲ ${Number(c.score || 0).toLocaleString()}</span></div>
        <div class="rj-c-body">${escapeHtml(c.body)}</div>
      `;
      commentsEl.appendChild(div);
    });

    commentOffsets[post.postId] += comments.length;
    if (numEl) numEl.textContent = `[ ${cellIndex}]:`;

    const loadMore    = document.createElement('button');
    loadMore.className = 'rj-load-more';
    loadMore.textContent = '▶  Load more comments';
    loadMore.addEventListener('click', () => handleRun(post, cellIndex));
    commentsEl.appendChild(loadMore);

  } catch (err) {
    commentsEl.innerHTML += `<div class="rj-error">Error fetching comments: ${escapeHtml(err.message)}</div>`;
    if (numEl) numEl.textContent = `[ ${cellIndex}]:`;
  }

  if (btn) { btn.innerHTML = '▶'; btn.disabled = false; }
  document.getElementById('rj-session-label').textContent = 'Draft Session Active (Kernel ready)';
}

// ─── FETCH COMMENTS ──────────────────────────────────────
async function fetchComments(post, offset = 0) {
  const res = await fetch(`https://old.reddit.com${post.permalink}.json?limit=50`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return (data[1]?.data?.children || [])
    .filter(c => c.kind === 't1' && c.data?.body)
    .map(c => ({ author: c.data.author, body: c.data.body, score: c.data.score }))
    .slice(offset, offset + 5);
}

// ─── RENDER MEDIA ────────────────────────────────────────
function renderMedia(post, el) {
  const url = post.url || '';
  if (/\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(url) || url.includes('i.redd.it')) {
    el.innerHTML = `<img src="${escapeHtml(url)}" alt="" loading="lazy">`;
  } else if (url.includes('v.redd.it')) {
    el.innerHTML = `<video controls><source src="${escapeHtml(url)}/DASH_480.mp4" type="video/mp4"></video>`;
  } else if (/\.gifv?$/i.test(url)) {
    el.innerHTML = `<video autoplay loop muted playsinline><source src="${escapeHtml(url.replace('.gifv','.mp4'))}" type="video/mp4"></video>`;
  }
}

// ─── HELPER ──────────────────────────────────────────────
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
