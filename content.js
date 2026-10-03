// ===== REDDIT JUPY - content.js (Kaggle 1:1 clone) =====

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
      postId:    el.getAttribute('data-fullname').replace('t3_', ''),
      title:     titleEl?.textContent?.trim() || 'Untitled',
      author:    el.getAttribute('data-author')    || 'unknown',
      subreddit: el.getAttribute('data-subreddit') || '',
      score:     el.getAttribute('data-score')     || '0',
      url:       el.getAttribute('data-url')       || '',
      permalink: el.getAttribute('data-permalink') || '',
      domain:    el.getAttribute('data-domain')    || '',
    });
  });
  return posts;
}

// ─── BUILD NOTEBOOK (Kaggle layout) ─────────────────────
function buildNotebook(posts) {
  const sub      = posts[0]?.subreddit || 'home';
  const notebook = document.createElement('div');
  notebook.id    = 'rj-notebook';

  notebook.innerHTML = `

    <!-- TOP BAR: exactly like Kaggle's title bar -->
    <div id="rj-topbar">
      <div id="rj-topbar-left">
        <!-- Kaggle "K" logo -->
        <div id="rj-k-logo">
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="4" fill="#20BEFF"/>
            <path d="M9 6h4v8.5l7-8.5h5L17 15.5 25 26h-5l-7-9V26H9V6z" fill="white"/>
          </svg>
        </div>
        <div id="rj-notebook-name">
          <span id="rj-nb-title">r/${sub}</span>
          <span id="rj-nb-draft">Draft saved</span>
        </div>
        <span class="rj-topbar-sep"></span>
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
      <div id="rj-topbar-right">
        <button class="rj-top-btn rj-share-btn">Share</button>
        <button class="rj-top-btn rj-save-btn" id="rj-theme-toggle">
          Save Version &nbsp;<span class="rj-version-badge">0</span>
        </button>
      </div>
    </div>

    <!-- SECOND TOOLBAR: action bar like Kaggle -->
    <div id="rj-toolbar">
      <div id="rj-toolbar-left">
        <button class="rj-tb-icon" title="Cut">&#9986;</button>
        <button class="rj-tb-icon" title="Copy">&#9113;</button>
        <button class="rj-tb-icon" title="Paste">&#128203;</button>
        <div class="rj-tb-sep"></div>
        <button class="rj-tb-icon" title="Move up">&#9650;</button>
        <button class="rj-tb-icon" title="Move down">&#9660;</button>
        <div class="rj-tb-sep"></div>
        <button class="rj-tb-run" title="Run selected cell">&#9654;</button>
        <button class="rj-tb-runall" title="Run all cells">&#9654;&#9654; Run All</button>
        <div class="rj-tb-sep"></div>
        <div class="rj-tb-dropdown">
          <span>Markdown</span>
          <span class="rj-tb-caret">&#9660;</span>
        </div>
      </div>
      <div id="rj-toolbar-center">
        <span id="rj-session-status">Draft Session off (run a cell to start)</span>
      </div>
      <div id="rj-toolbar-right">
        <button class="rj-tb-icon" title="Settings">&#9881;</button>
        <button class="rj-tb-icon" title="Menu">&#9776;</button>
      </div>
    </div>

    <!-- MAIN BODY -->
    <div id="rj-body">

      <!-- CENTER: notebook cells -->
      <div id="rj-main">
        <div id="rj-cells"></div>
      </div>

      <!-- RIGHT SIDEBAR: exact Kaggle panel order -->
      <aside id="rj-sidebar">

        <!-- 1. Notebook / Input (top) -->
        <div class="rj-sb-section">
          <div class="rj-sb-header">
            <span>Notebook</span>
            <span class="rj-sb-arrow">&#9650;</span>
          </div>
          <div class="rj-sb-body">
            <div class="rj-sb-sub-header">
              <span>Input</span>
              <span class="rj-sb-arrow">&#9650;</span>
            </div>
            <div class="rj-sb-input-btns">
              <button class="rj-sb-btn">+ Add Input</button>
              <button class="rj-sb-btn">&#8679; Upload</button>
            </div>
            <div class="rj-sb-no-input">
              <div class="rj-sb-icon-wrap">
                <!-- Kaggle dataset icon placeholder -->
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="22" fill="#e8f4fb" stroke="#0097dc" stroke-width="1.5"/>
                  <rect x="14" y="18" width="20" height="14" rx="2" fill="#0097dc" opacity="0.3"/>
                  <rect x="18" y="14" width="12" height="18" rx="2" fill="#0097dc" opacity="0.5"/>
                  <circle cx="24" cy="24" r="4" fill="#0097dc"/>
                </svg>
              </div>
              <div class="rj-sb-no-text">No input attached</div>
              <div class="rj-sb-no-sub">Attach a Kaggle dataset, model, or competition</div>
            </div>
          </div>
        </div>

        <!-- 2. Output -->
        <div class="rj-sb-section">
          <div class="rj-sb-header">
            <span>Output</span>
            <span class="rj-sb-arrow">&#9650;</span>
          </div>
          <div class="rj-sb-body rj-sb-output">
            <div class="rj-sb-output-row">
              <span class="rj-sb-folder">&#128193; /kaggle/working</span>
              <span class="rj-sb-gear">&#9881;</span>
            </div>
          </div>
        </div>

        <!-- 3. Table of Contents -->
        <div class="rj-sb-section">
          <div class="rj-sb-header">
            <span>Table of contents</span>
            <span class="rj-sb-arrow">&#9650;</span>
          </div>
          <div class="rj-sb-body">
            <div class="rj-sb-toc-empty">
              <div class="rj-sb-icon-wrap">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="22" fill="#f5f5f5" stroke="#e0e0e0" stroke-width="1.5"/>
                  <rect x="14" y="16" width="16" height="2.5" rx="1" fill="#bbb"/>
                  <rect x="14" y="22" width="20" height="2.5" rx="1" fill="#bbb"/>
                  <rect x="14" y="28" width="12" height="2.5" rx="1" fill="#bbb"/>
                </svg>
              </div>
              <div class="rj-sb-no-text">No sections detected</div>
              <div class="rj-sb-no-sub">Add markdown headers to add a section</div>
            </div>
            <div class="rj-toc" id="rj-toc"></div>
          </div>
        </div>

        <!-- 4. Session options (bottom) -->
        <div class="rj-sb-section">
          <div class="rj-sb-header">
            <span>Session options</span>
            <span class="rj-sb-arrow">&#9660;</span>
          </div>
          <!-- collapsed by default -->
        </div>

      </aside>
    </div>
  `;

  const cellsEl = notebook.querySelector('#rj-cells');
  const tocEl   = notebook.querySelector('#rj-toc');

  posts.forEach(post => {
    cellsEl.appendChild(buildCell(post));
    const tocItem = document.createElement('div');
    tocItem.className  = 'rj-toc-item';
    tocItem.textContent = `${post.title.slice(0, 40)}${post.title.length > 40 ? '…' : ''}`;
    tocItem.addEventListener('click', () =>
      document.getElementById(`rj-cell-${post.postId}`)?.scrollIntoView({ behavior: 'smooth' })
    );
    tocEl.appendChild(tocItem);
  });

  // Theme toggle — "Save Version" button switches theme
  notebook.querySelector('#rj-theme-toggle').addEventListener('click', toggleTheme);

  document.body.appendChild(notebook);
}

// ─── THEME TOGGLE ────────────────────────────────────────
let currentTheme = 'kaggle';
function toggleTheme() {
  currentTheme = currentTheme === 'kaggle' ? 'jupyter' : 'kaggle';
  document.documentElement.setAttribute('data-theme', currentTheme);
}

// ─── BUILD CELL ──────────────────────────────────────────
function buildCell(post) {
  const wrapper    = document.createElement('div');
  wrapper.className = 'rj-cell-wrapper';
  wrapper.id        = `rj-cell-${post.postId}`;

  wrapper.innerHTML = `
    <!-- INPUT ROW -->
    <div class="rj-row rj-input-row">
      <div class="rj-gutter">
        <button class="rj-run-btn" title="Run cell">&#9654;</button>
        <span class="rj-gutter-num">[ ]:</span>
      </div>
      <div class="rj-cell-box">
        <div class="rj-cell-inner">
          <div class="rj-post-title">
            <a href="https://old.reddit.com${post.permalink}" target="_blank">${post.title}</a>
          </div>
          <div class="rj-post-meta">
            <span class="rj-meta-sub">r/${post.subreddit}</span>
            <span class="rj-dot">·</span>
            <span class="rj-meta-author">u/${post.author}</span>
            <span class="rj-dot">·</span>
            <span class="rj-meta-score">▲ ${Number(post.score || 0).toLocaleString()}</span>
            ${post.domain && !post.domain.startsWith('self.') ? `<span class="rj-dot">·</span><span class="rj-meta-domain">${post.domain}</span>` : ''}
          </div>
        </div>
        <div class="rj-cell-actions">
          <button class="rj-cell-nav" title="Move up">&#9650;</button>
          <button class="rj-cell-nav" title="Move down">&#9660;</button>
          <button class="rj-cell-more" title="More">&#8942;</button>
        </div>
      </div>
    </div>

    <!-- OUTPUT ROW (hidden until Run) -->
    <div class="rj-row rj-output-row" id="rj-output-${post.postId}" style="display:none">
      <div class="rj-gutter rj-out-gutter">
        <span class="rj-gutter-num rj-out-num">[${post.index}]:</span>
      </div>
      <div class="rj-output-box">
        <div class="rj-media-wrap" id="rj-media-${post.postId}"></div>
        <div class="rj-comments" id="rj-comments-${post.postId}"></div>
      </div>
    </div>
  `;

  wrapper.querySelector('.rj-run-btn')
    .addEventListener('click', () => handleRun(post));
  return wrapper;
}

// ─── HANDLE RUN ──────────────────────────────────────────
async function handleRun(post) {
  const outputRow  = document.getElementById(`rj-output-${post.postId}`);
  const mediaEl    = document.getElementById(`rj-media-${post.postId}`);
  const commentsEl = document.getElementById(`rj-comments-${post.postId}`);
  const wrapper    = document.getElementById(`rj-cell-${post.postId}`);
  const btn        = wrapper.querySelector('.rj-run-btn');
  const numEl      = wrapper.querySelector('.rj-gutter-num');

  outputRow.style.display = 'flex';
  wrapper.classList.add('ran');
  numEl.textContent = `[*]:`;

  // Update session status
  document.getElementById('rj-session-status').textContent = 'Kernel busy…';

  if (!commentOffsets[post.postId]) {
    commentOffsets[post.postId] = 0;
    renderMedia(post, mediaEl);
  }

  btn.innerHTML = '<span class="rj-spinner"></span>';
  btn.disabled  = true;

  try {
    const offset   = commentOffsets[post.postId];
    const comments = await fetchComments(post, offset);

    commentsEl.querySelector('.rj-load-more')?.remove();

    if (!comments.length) {
      commentsEl.innerHTML += `<div class="rj-no-more">── end of thread ──</div>`;
      numEl.textContent = `[${post.index}]:`;
      btn.innerHTML     = '&#9654;';
      btn.disabled      = false;
      document.getElementById('rj-session-status').textContent = 'Draft Session off (run a cell to start)';
      return;
    }

    comments.forEach((c, i) => {
      const div      = document.createElement('div');
      div.className  = 'rj-comment';
      div.innerHTML  = `
        <div class="rj-c-author">u/${c.author} <span class="rj-c-score">▲ ${c.score}</span></div>
        <div class="rj-c-body">${c.body}</div>
      `;
      commentsEl.appendChild(div);
    });

    commentOffsets[post.postId] += comments.length;
    numEl.textContent = `[${post.index}]:`;

    const loadMore    = document.createElement('button');
    loadMore.className = 'rj-load-more';
    loadMore.textContent = '▶  Load 5 more comments';
    loadMore.addEventListener('click', () => handleRun(post));
    commentsEl.appendChild(loadMore);

  } catch (err) {
    commentsEl.innerHTML += `<div class="rj-error">${err.message}</div>`;
    numEl.textContent = `[${post.index}]:`;
  }

  btn.innerHTML  = '&#9654;';
  btn.disabled   = false;
  document.getElementById('rj-session-status').textContent = 'Draft Session off (run a cell to start)';
}

// ─── FETCH COMMENTS ──────────────────────────────────────
async function fetchComments(post, offset = 0) {
  const res  = await fetch(`https://old.reddit.com${post.permalink}.json?limit=50`);
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
    el.innerHTML = `<img src="${url}" alt="" loading="lazy">`;
  } else if (url.includes('v.redd.it')) {
    el.innerHTML = `<video controls><source src="${url}/DASH_480.mp4" type="video/mp4"></video>`;
  } else if (/\.gifv?$/i.test(url)) {
    el.innerHTML = `<video autoplay loop muted playsinline><source src="${url.replace('.gifv','.mp4')}" type="video/mp4"></video>`;
  }
}
