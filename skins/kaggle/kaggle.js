// ===== REDDIT JUPY - skins/kaggle/kaggle.js =====

class KaggleSkin extends BaseSkin {
  constructor(state) {
    super('kaggle', state);
  }

  mount() {
    const sub = this.state.currentSubreddit || 'all';
    const notebook = document.createElement('div');
    notebook.id = 'rj-notebook';
    this.rootElement = notebook;

    notebook.innerHTML = `
      <!-- ROW 1: TOP HEADER (Full Width Header with Share & Save Version 0) -->
      <div id="rj-top-header">
        <div id="rj-title-group">
          <span id="rj-nb-title">r/${escapeHtml(sub)}: Reddit Community &amp; Data Pipeline Analysis</span>
          <span id="rj-nb-draft">Draft saved</span>
        </div>
        <div id="rj-top-header-right">
          <select id="rj-skin-switcher" style="background:var(--surface2); color:var(--text-white); border:1px solid var(--border); border-radius:4px; font-size:12px; padding:4px 8px; outline:none; cursor:pointer;">
            <option value="kaggle" selected> Kaggle Notebook</option>
            <option value="jupyter"> Jupyter Notebook</option>
          </select>
          <button class="rj-share-btn">${ICONS.people} <span>Share</span></button>
          <button class="rj-save-btn" id="rj-theme-toggle" title="Save Version & toggle themes">
            ${ICONS.update} <span>Save Version</span> <span class="rj-ver-badge">0</span>
          </button>
        </div>
      </div>

      <!-- MAIN BODY LAYOUT (Nav + Center Editor + Docked 380px Right Panel) -->
      <div id="rj-body-layout">

        <!-- KAGGLE LEFT NAV BAR -->
        <nav id="rj-leftnav">
          <button class="rj-nav-icon active" title="Menu">${ICONS.hamburger}</button>
          <div class="rj-nav-spacer"></div>
          <button class="rj-nav-icon" id="rj-nav-add-cell" title="Create Cell" style="background:#20beff; color:#ffffff; border-radius:50%; width:32px; height:32px;">
            ${ICONS.plus}
          </button>
          <button class="rj-nav-icon" title="Home">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
          </button>
          <button class="rj-nav-icon" title="Competitions">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
          </button>
          <button class="rj-nav-icon" id="rj-nav-datasets" title="Datasets (Add Input)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20 6h-2.18c.07-.44.18-.88.18-1.36C18 2.05 15.96 0 13.36 0c-1.46 0-2.75.67-3.63 1.72L9 3 7.27 1.72C6.39.67 5.1 0 3.64 0 1.04 0-1 2.05-1 4.64c0 .48.11.92.18 1.36H-2v2h22V6zm-9.5-.14c.53-.66 1.32-1.1 2.22-1.1 1.58 0 2.86 1.28 2.86 2.86 0 .31-.07.59-.16.86h-6.14l1.22-2.62zM3.64 5.5c-.31 0-.59-.07-.86-.16V4.64c0-1.58 1.28-2.86 2.86-2.86.9 0 1.69.44 2.22 1.1l1.22 2.62H3.64zM2 8h20v13H2z"/></svg>
          </button>
          <button class="rj-nav-icon rj-nav-active" title="Code">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>
          </button>
          <button class="rj-nav-icon" title="Discuss">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>
          </button>
        </nav>

        <!-- CENTER PANE -->
        <div id="rj-center-pane">

          <!-- ROW 2: MENU BAR (Pure White Text, Bottom Border) -->
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
              <button class="rj-tb-btn" id="rj-tb-add-cell" title="Add code cell">${ICONS.plus}</button>
              <button class="rj-tb-btn rj-tb-caret-btn" title="More add options">▾</button>
              <div class="rj-tb-sep"></div>
              <button class="rj-tb-btn" title="Cut">${ICONS.cut}</button>
              <button class="rj-tb-btn" title="Copy">${ICONS.copy}</button>
              <button class="rj-tb-btn" title="Paste">${ICONS.paste}</button>
              <div class="rj-tb-sep"></div>
              <button class="rj-tb-btn" id="rj-tb-run-first" title="Run cell">${ICONS.play}</button>
              <button class="rj-tb-runall" id="rj-tb-run-all" title="Run all cells">▶▶ Run All</button>
              <div class="rj-tb-sep"></div>
              <span class="rj-tb-dropdown-plain">Code ▾</span>
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

          <!-- NOTEBOOK CELLS AREA (Left-aligned, End-to-End) -->
          <div id="rj-main">
            <div id="rj-cells">
              
              <!-- Initial Setup Cell -->
              <div class="rj-cell-wrapper" id="rj-cell-setup">
                <div class="rj-row">
                  <div class="rj-gutter">
                    <button class="rj-run-btn" title="Run cell">▶</button>
                    <span class="rj-gutter-num">[ 1]:</span>
                  </div>
                  <div class="rj-cell-box">
                    <div class="rj-code-cell">
                      <span class="rj-code-line"><span class="rj-kw">import</span> <span class="rj-var">plotly.express</span> <span class="rj-kw">as</span> <span class="rj-var">px</span></span>
                      <span class="rj-code-line"><span class="rj-kw">import</span> <span class="rj-var">plotly.graph_objects</span> <span class="rj-kw">as</span> <span class="rj-var">go</span></span>
                      <span class="rj-code-line"><span class="rj-kw">from</span> <span class="rj-var">sklearn.preprocessing</span> <span class="rj-kw">import</span> <span class="rj-var">StandardScaler</span></span>
                      <span class="rj-code-line"><span class="rj-kw">from</span> <span class="rj-var">sklearn.cluster</span> <span class="rj-kw">import</span> <span class="rj-var">KMeans</span></span>
                      <span class="rj-code-line"><span class="rj-kw">import</span> <span class="rj-var">warnings</span></span>
                      <span class="rj-code-blank"></span>
                      <span class="rj-code-comment"># Configuration</span>
                      <span class="rj-code-line"><span class="rj-var">warnings</span>.<span class="rj-func">filterwarnings</span>(<span class="rj-str">'ignore'</span>)</span>
                      <span class="rj-code-blank"></span>
                      <span class="rj-code-line"><span class="rj-func">print</span>(<span class="rj-str">'✅ Setup Complete. Libraries Loaded.'</span>)</span>
                    </div>
                    <div class="rj-cell-actions">
                      <button class="rj-cell-nav rj-cell-up">▲</button>
                      <button class="rj-cell-nav rj-cell-down">▼</button>
                      <button class="rj-cell-more rj-cell-del" title="Delete cell">🗑</button>
                    </div>
                  </div>
                </div>
                <div class="rj-cell-bottom-bar">
                  <button class="rj-btn-pill rj-add-code-btn">+ Code</button>
                  <button class="rj-btn-pill rj-add-md-btn">+ Markdown</button>
                </div>
              </div>

            </div>
          </div>

        </div><!-- end rj-center-pane -->

        <!-- DOCKED WIDE RIGHT PANEL (380px Width, No Shadow) -->
        <aside id="rj-notebook-panel">
          <div id="rj-panel-header">
            <span id="rj-panel-title">Notebook</span>
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
                  <button class="rj-ps-btn" id="rj-btn-add-input">${ICONS.plus} Add Input</button>
                  <button class="rj-ps-btn">${ICONS.upload} Upload</button>
                </div>
                <div class="rj-ps-datasets-label">DATASETS</div>
                <div class="rj-ps-tree-item">
                  <span>▾</span>
                  <span>🗃</span>
                  <span id="rj-panel-feed-name">r/${escapeHtml(sub)}_feed</span>
                </div>
                <div class="rj-ps-tree-subitem">
                  ${ICONS.file}
                  <span id="rj-panel-csv-name">${escapeHtml(sub)}_posts (${this.state.posts.length} rows).csv</span>
                </div>
                <div class="rj-ps-tree-subitem">
                  ${ICONS.file}
                  <span>comments_index.json</span>
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
                <div class="rj-ps-output-row">
                  <span class="rj-ps-folder">▾ ${ICONS.folder} /kaggle/working</span>
                  <button class="rj-ps-refresh-btn" title="Refresh folder">${ICONS.refresh}</button>
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

        <!-- Bottom Floating Panel Toggle Tab -->
        <button id="rj-panel-tab" title="Toggle Notebook panel">▶</button>

      </div><!-- end rj-body-layout -->

      <!-- KAGGLE ADD DATASET / SUBREDDIT SEARCH MODAL -->
      <div id="rj-modal-overlay" class="hidden">
        <div id="rj-modal-card">
          <div id="rj-modal-header">
            <span id="rj-modal-title">Search &amp; Add Subreddit Dataset</span>
            <button id="rj-modal-close-btn" title="Close">✕</button>
          </div>
          <div id="rj-modal-search-wrap">
            <input type="text" id="rj-modal-search-input" placeholder="Search subreddits (e.g. machinelearning, python, technology)..." />
          </div>
          <div id="rj-modal-results">
            <div style="color:var(--text-muted); padding:12px 0; text-align:center;">Type a subreddit name to search datasets...</div>
          </div>
        </div>
      </div>
    `;

    // Render cells & TOC
    this.renderPosts(this.state.posts);

    // Setup Pagination "Load More" cell
    this.setupPaginationCell();

    // Attach global cell actions (Add cell, Reorder, Delete)
    this.setupCellListeners();

    // Attach UI interactive handlers
    this.setupUIHandlers();

    document.body.appendChild(notebook);
  }

  renderPosts(posts) {
    const cellsEl = this.rootElement.querySelector('#rj-cells');
    const tocList = this.rootElement.querySelector('#rj-toc-list');
    if (!cellsEl || !tocList) return;

    // Clear existing post cells if rebuilding
    const existingPostCells = cellsEl.querySelectorAll('.rj-post-cell-wrapper');
    existingPostCells.forEach(el => el.remove());
    tocList.innerHTML = '';

    // Initial TOC item
    const tocSetup = document.createElement('div');
    tocSetup.className = 'rj-toc-item active';
    tocSetup.innerHTML = `<span>⚡</span> <span>Environment Setup</span>`;
    tocSetup.addEventListener('click', () => {
      document.getElementById('rj-cell-setup')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    tocList.appendChild(tocSetup);

    this.appendPosts(posts);
  }

  appendPosts(newPosts) {
    const cellsEl = this.rootElement.querySelector('#rj-cells');
    const tocList = this.rootElement.querySelector('#rj-toc-list');
    const paginationCell = this.rootElement.querySelector('#rj-pagination-cell');

    newPosts.forEach((post) => {
      const cellIdx = executionCounter++;
      // 1. Markdown cell
      const mdWrapper = this.buildMarkdownCell(post, cellIdx);
      mdWrapper.classList.add('rj-post-cell-wrapper');

      // 2. Python Code cell
      const codeWrapper = this.buildCodeCell(post, cellIdx + 1);
      codeWrapper.classList.add('rj-post-cell-wrapper');

      if (paginationCell && paginationCell.parentNode === cellsEl) {
        cellsEl.insertBefore(mdWrapper, paginationCell);
        cellsEl.insertBefore(codeWrapper, paginationCell);
      } else {
        cellsEl.appendChild(mdWrapper);
        cellsEl.appendChild(codeWrapper);
      }

      // TOC Entry
      const ti = document.createElement('div');
      ti.className = 'rj-toc-item';
      ti.id = `rj-toc-item-${post.postId}`;
      ti.innerHTML = `<span>${ICONS.file}</span> <span>${escapeHtml(post.title.slice(0, 36))}${post.title.length > 36 ? '…' : ''}</span>`;
      ti.addEventListener('click', () => {
        const cellEl = document.getElementById(`rj-md-cell-${post.postId}`);
        if (cellEl) {
          cellEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        document.querySelectorAll('.rj-toc-item').forEach(el => el.classList.remove('active'));
        ti.classList.add('active');
      });
      tocList.appendChild(ti);
    });
  }

  updateStatus(statusText, isActive = false) {
    const label = document.getElementById('rj-session-label');
    const dot = document.getElementById('rj-status-dot');
    if (label) label.textContent = statusText;
    if (dot) dot.classList.toggle('active', isActive);
  }

  setupUIHandlers() {
    const notebook = this.rootElement;
    const panel    = notebook.querySelector('#rj-notebook-panel');
    const tab      = notebook.querySelector('#rj-panel-tab');
    const tbToggle = notebook.querySelector('#rj-nb-toggle-btn');

    function togglePanel() {
      const isClosed = panel.classList.toggle('closed');
      tab.classList.toggle('panel-closed', isClosed);
      tab.innerHTML = isClosed ? '◀' : '▶';
    }

    tab?.addEventListener('click', togglePanel);
    tbToggle?.addEventListener('click', togglePanel);

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
    notebook.querySelector('#rj-theme-toggle')?.addEventListener('click', () => this.toggleTheme());

    // Run all button
    notebook.querySelector('#rj-tb-run-all')?.addEventListener('click', () => {
      this.state.posts.slice(0, 5).forEach((p, idx) => {
        setTimeout(() => this.handleRun(p), idx * 600);
      });
    });

    // Run first cell
    notebook.querySelector('#rj-tb-run-first')?.addEventListener('click', () => {
      if (this.state.posts[0]) this.handleRun(this.state.posts[0]);
    });

    // Top toolbar + button to add empty code cell
    notebook.querySelector('#rj-tb-add-cell')?.addEventListener('click', () => {
      this.createEmptyCodeCell(null);
    });
    notebook.querySelector('#rj-nav-add-cell')?.addEventListener('click', () => {
      this.createEmptyCodeCell(null);
    });

    // Power & refresh handlers
    notebook.querySelector('#rj-btn-refresh')?.addEventListener('click', () => {
      this.updateStatus('Kernel restarting…', false);
      setTimeout(() => {
        this.updateStatus('Draft Session Active (Kernel ready)', true);
      }, 1000);
    });

    notebook.querySelector('#rj-btn-power')?.addEventListener('click', () => {
      this.updateStatus('Draft Session off (run a cell to start)', false);
    });

    // Skin Switcher Dropdown
    const skinSelect = notebook.querySelector('#rj-skin-switcher');
    skinSelect?.addEventListener('change', (e) => {
      window.switchSkin(e.target.value);
    });

    // Wire Modal Events
    this.setupSearchModal();
  }

  setupSearchModal() {
    const modal = this.rootElement.querySelector('#rj-modal-overlay');
    const closeBtn = this.rootElement.querySelector('#rj-modal-close-btn');
    const inputEl = this.rootElement.querySelector('#rj-modal-search-input');
    const resultsEl = this.rootElement.querySelector('#rj-modal-results');
    const addInputBtn = this.rootElement.querySelector('#rj-btn-add-input');
    const navDatasetsBtn = this.rootElement.querySelector('#rj-nav-datasets');

    const openModal = () => {
      modal.classList.remove('hidden');
      inputEl.value = '';
      inputEl.focus();
    };

    const closeModal = () => {
      modal.classList.add('hidden');
    };

    addInputBtn?.addEventListener('click', openModal);
    navDatasetsBtn?.addEventListener('click', openModal);
    closeBtn?.addEventListener('click', closeModal);
    modal?.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    let searchTimeout = null;
    inputEl?.addEventListener('input', () => {
      clearTimeout(searchTimeout);
      const query = inputEl.value.trim();
      if (!query) {
        resultsEl.innerHTML = `<div style="color:var(--text-muted); padding:12px 0; text-align:center;">Type a subreddit name to search datasets...</div>`;
        return;
      }

      resultsEl.innerHTML = `<div style="color:var(--text-muted); padding:12px 0; text-align:center;"><span class="rj-spinner"></span> Searching subreddits...</div>`;

      searchTimeout = setTimeout(async () => {
        const results = await searchSubreddits(query);
        if (!results || !results.length) {
          resultsEl.innerHTML = `<div style="color:var(--text-muted); padding:12px 0; text-align:center;">No subreddits found matching "${escapeHtml(query)}"</div>`;
          return;
        }

        resultsEl.innerHTML = '';
        results.forEach(sub => {
          const item = document.createElement('div');
          item.className = 'rj-modal-result-item';
          const subsFormatted = Number(sub.subscribers || 0).toLocaleString();
          item.innerHTML = `
            <div>
              <div class="rj-modal-res-name">r/${escapeHtml(sub.name)}</div>
              <div class="rj-modal-res-title">${escapeHtml(sub.title || sub.description || '')}</div>
            </div>
            <div class="rj-modal-res-subs">${subsFormatted} members</div>
          `;
          item.addEventListener('click', async () => {
            closeModal();
            await this.switchToSubreddit(sub.name);
          });
          resultsEl.appendChild(item);
        });
      }, 300);
    });
  }

  async switchToSubreddit(subredditName) {
    this.state.currentSubreddit = subredditName;
    this.state.afterToken = null;
    this.state.isLoading = true;

    document.getElementById('rj-nb-title').textContent = `r/${subredditName}: Reddit Community & Data Pipeline Analysis`;
    document.getElementById('rj-panel-feed-name').textContent = `r/${subredditName}_feed`;
    this.updateStatus(`Draft Session Active (Loading r/${subredditName}...)`, true);

    try {
      const posts = await fetchSubredditPosts(subredditName, null, 25);
      this.state.posts = posts;
      this.renderPosts(posts);
      const csvName = document.getElementById('rj-panel-csv-name');
      if (csvName) csvName.textContent = `${subredditName}_posts (${posts.length} rows).csv`;
    } catch (err) {
      console.error('Error switching subreddit:', err);
    } finally {
      this.state.isLoading = false;
      this.updateStatus('Draft Session Active (Kernel ready)', true);
    }
  }

  setupPaginationCell() {
    const cellsEl = this.rootElement.querySelector('#rj-cells');
    const wrapper = document.createElement('div');
    wrapper.className = 'rj-cell-wrapper';
    wrapper.id = 'rj-pagination-cell';

    wrapper.innerHTML = `
      <div class="rj-row">
        <div class="rj-gutter">
          <button class="rj-run-btn" id="rj-btn-fetch-more" title="Load more posts">▶</button>
          <span class="rj-gutter-num">[ ⤓ ]:</span>
        </div>
        <div class="rj-cell-box">
          <div class="rj-code-cell" style="display:flex; justify-content:space-between; align-items:center;">
            <span class="rj-code-line">
              <span class="rj-kw">def</span> <span class="rj-func">fetch_next_batch</span>(<span class="rj-var">limit</span>=<span class="rj-str">25</span>): <span class="rj-code-comment"># Click ▶ to fetch next batch of subreddit posts</span>
            </span>
            <button class="rj-btn-pill" id="rj-btn-fetch-more-pill" style="background:#2e3033; color:#ffffff; font-weight:600; font-size:12px; border:1px solid #3c4043; cursor:pointer;">
              Fetch Next 25 Posts
            </button>
          </div>
        </div>
      </div>
    `;

    const loadNext = async () => {
      if (this.state.isLoading) return;
      this.state.isLoading = true;
      const runBtn = wrapper.querySelector('#rj-btn-fetch-more');
      const pillBtn = wrapper.querySelector('#rj-btn-fetch-more-pill');
      if (runBtn) runBtn.innerHTML = '<span class="rj-spinner"></span>';
      if (pillBtn) pillBtn.textContent = 'Fetching posts...';

      this.updateStatus('Draft Session Active (Fetching next batch...)', true);

      try {
        const morePosts = await fetchSubredditPosts(this.state.currentSubreddit, this.state.afterToken, 25);
        if (morePosts.length > 0) {
          this.state.posts = this.state.posts.concat(morePosts);
          this.appendPosts(morePosts);
          const csvName = document.getElementById('rj-panel-csv-name');
          if (csvName) csvName.textContent = `${this.state.currentSubreddit}_posts (${this.state.posts.length} rows).csv`;
        }
      } catch (err) {
        console.error('Failed to paginate:', err);
      } finally {
        this.state.isLoading = false;
        if (runBtn) runBtn.innerHTML = '▶';
        if (pillBtn) pillBtn.textContent = 'Fetch Next 25 Posts';
        this.updateStatus('Draft Session Active (Kernel ready)', true);
      }
    };

    wrapper.querySelector('#rj-btn-fetch-more')?.addEventListener('click', loadNext);
    wrapper.querySelector('#rj-btn-fetch-more-pill')?.addEventListener('click', loadNext);

    cellsEl.appendChild(wrapper);
  }

  setupCellListeners() {
    // 1. Active Cell Click Tracking
    this.rootElement.addEventListener('click', (e) => {
      const cell = e.target.closest('.rj-cell-wrapper');
      if (cell) {
        document.querySelectorAll('.rj-cell-wrapper').forEach(c => c.classList.remove('rj-cell-active'));
        cell.classList.add('rj-cell-active');
      }

      const addCodeBtn = e.target.closest('.rj-add-code-btn');
      if (addCodeBtn) {
        const parentCell = addCodeBtn.closest('.rj-cell-wrapper');
        this.createEmptyCodeCell(parentCell);
        return;
      }

      const addMdBtn = e.target.closest('.rj-add-md-btn');
      if (addMdBtn) {
        const parentCell = addMdBtn.closest('.rj-cell-wrapper');
        this.createEmptyMarkdownCell(parentCell);
        return;
      }

      const upBtn = e.target.closest('.rj-cell-up');
      if (upBtn) {
        const cell = upBtn.closest('.rj-cell-wrapper');
        if (cell && cell.previousElementSibling && cell.previousElementSibling.id !== 'rj-cell-setup') {
          cell.parentElement.insertBefore(cell, cell.previousElementSibling);
        }
        return;
      }

      const downBtn = e.target.closest('.rj-cell-down');
      if (downBtn) {
        const cell = downBtn.closest('.rj-cell-wrapper');
        if (cell && cell.nextElementSibling && cell.nextElementSibling.id !== 'rj-pagination-cell') {
          cell.parentElement.insertBefore(cell.nextElementSibling, cell);
        }
        return;
      }

      const delBtn = e.target.closest('.rj-cell-del');
      if (delBtn) {
        const cell = delBtn.closest('.rj-cell-wrapper');
        if (cell) cell.remove();
        return;
      }
    });

    // 2. Global Shift+Enter / Ctrl+Enter Execution Shortcut
    document.addEventListener('keydown', (e) => {
      if ((e.shiftKey && e.key === 'Enter') || ((e.ctrlKey || e.metaKey) && e.key === 'Enter')) {
        e.preventDefault();

        // Find active cell
        let currentCell = document.activeElement?.closest('.rj-cell-wrapper') ||
                          document.querySelector('.rj-cell-wrapper.rj-cell-active');

        if (!currentCell) {
          currentCell = document.querySelector('.rj-cell-wrapper');
        }

        if (currentCell) {
          // Trigger cell execution
          const runBtn = currentCell.querySelector('.rj-run-btn');
          if (runBtn) {
            runBtn.click();
          }

          // Advance to next cell on Shift+Enter
          if (e.shiftKey) {
            let nextCell = currentCell.nextElementSibling;
            while (nextCell && (!nextCell.classList.contains('rj-cell-wrapper') || nextCell.id === 'rj-pagination-cell')) {
              if (nextCell.id === 'rj-pagination-cell') {
                nextCell.querySelector('.rj-run-btn')?.click();
                break;
              }
              nextCell = nextCell.nextElementSibling;
            }

            if (nextCell && nextCell.classList.contains('rj-cell-wrapper')) {
              document.querySelectorAll('.rj-cell-wrapper').forEach(c => c.classList.remove('rj-cell-active'));
              nextCell.classList.add('rj-cell-active');
              nextCell.scrollIntoView({ behavior: 'smooth', block: 'center' });
              const nextInput = nextCell.querySelector('textarea');
              if (nextInput) nextInput.focus();
            }
          }
        }
      }
    });
  }

  createEmptyCodeCell(afterElement) {
    executionCounter++;
    const cellId = `rj-empty-code-${Date.now()}`;
    const wrapper = document.createElement('div');
    wrapper.className = 'rj-cell-wrapper';
    wrapper.id = cellId;

    wrapper.innerHTML = `
      <div class="rj-row">
        <div class="rj-gutter">
          <button class="rj-run-btn" title="Run cell">▶</button>
          <span class="rj-gutter-num">[  ]:</span>
        </div>
        <div class="rj-cell-box">
          <div class="rj-code-cell">
            <textarea class="rj-code-editor-input" placeholder="# Write Python code here...&#10;print('Hello Kaggle!')" rows="2"></textarea>
          </div>
          <div class="rj-cell-actions">
            <button class="rj-cell-nav rj-cell-up">▲</button>
            <button class="rj-cell-nav rj-cell-down">▼</button>
            <button class="rj-cell-more rj-cell-del" title="Delete cell">🗑</button>
          </div>
        </div>
      </div>
      <div class="rj-cell-bottom-bar">
        <button class="rj-btn-pill rj-add-code-btn">+ Code</button>
        <button class="rj-btn-pill rj-add-md-btn">+ Markdown</button>
      </div>
      <div class="rj-row rj-output-row" id="rj-output-${cellId}" style="display:none">
        <div class="rj-gutter rj-out-gutter">
          <span class="rj-gutter-num rj-out-num">[ ${executionCounter}]:</span>
        </div>
        <div class="rj-output-box">
          <pre class="rj-output-console"></pre>
        </div>
      </div>
    `;

    const textarea = wrapper.querySelector('.rj-code-editor-input');
    const runBtn   = wrapper.querySelector('.rj-run-btn');
    const numEl    = wrapper.querySelector('.rj-gutter-num');
    const outRow   = wrapper.querySelector(`#rj-output-${cellId}`);
    const outPre   = wrapper.querySelector('.rj-output-console');

    runBtn.addEventListener('click', () => {
      numEl.textContent = `[ *]:`;
      outRow.style.display = 'flex';
      this.updateStatus('Draft Session Active (Kernel running)', true);

      setTimeout(() => {
        const code = textarea.value.trim() || "print('Hello Kaggle!')";
        let result = '';
        try {
          if (code.includes('print(')) {
            const match = code.match(/print\((['"]?)(.*?)\1\)/);
            result = match ? match[2] : 'Output evaluated successfully.';
          } else {
            result = `Executed: ${code}`;
          }
        } catch (e) {
          result = `Traceback (most recent call last):\n  ${e.message}`;
        }
        outPre.textContent = result;
        numEl.textContent = `[ ${executionCounter}]:`;
        this.updateStatus('Draft Session Active (Kernel ready)', true);
      }, 400);
    });

    const cellsEl = document.getElementById('rj-cells');
    const paginationCell = document.getElementById('rj-pagination-cell');

    if (afterElement && afterElement.nextSibling) {
      cellsEl.insertBefore(wrapper, afterElement.nextSibling);
    } else if (paginationCell) {
      cellsEl.insertBefore(wrapper, paginationCell);
    } else {
      cellsEl.appendChild(wrapper);
    }

    textarea.focus();
    wrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  createEmptyMarkdownCell(afterElement) {
    const cellId = `rj-empty-md-${Date.now()}`;
    const wrapper = document.createElement('div');
    wrapper.className = 'rj-cell-wrapper';
    wrapper.id = cellId;

    wrapper.innerHTML = `
      <div class="rj-row">
        <div class="rj-gutter"></div>
        <div class="rj-markdown-cell">
          <textarea class="rj-md-editor-input" placeholder="# Heading 1&#10;Write markdown documentation here..." rows="3"></textarea>
        </div>
        <div class="rj-cell-actions">
          <button class="rj-cell-nav rj-cell-up">▲</button>
          <button class="rj-cell-nav rj-cell-down">▼</button>
          <button class="rj-cell-more rj-cell-del" title="Delete cell">🗑</button>
        </div>
      </div>
      <div class="rj-cell-bottom-bar">
        <button class="rj-btn-pill rj-add-code-btn">+ Code</button>
        <button class="rj-btn-pill rj-add-md-btn">+ Markdown</button>
      </div>
    `;

    const cellsEl = document.getElementById('rj-cells');
    const paginationCell = document.getElementById('rj-pagination-cell');

    if (afterElement && afterElement.nextSibling) {
      cellsEl.insertBefore(wrapper, afterElement.nextSibling);
    } else if (paginationCell) {
      cellsEl.insertBefore(wrapper, paginationCell);
    } else {
      cellsEl.appendChild(wrapper);
    }

    const textarea = wrapper.querySelector('.rj-md-editor-input');
    textarea.focus();
    wrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  toggleTheme() {
    const themes = ['dark', 'kaggle'];
    const idx = themes.indexOf(this.state.theme);
    this.state.theme = themes[(idx + 1) % themes.length];
    document.documentElement.setAttribute('data-theme', this.state.theme);
    const label = this.state.theme === 'dark' ? '0' : 'Light';
    document.querySelector('#rj-theme-toggle').innerHTML =
      `${ICONS.update} <span>Save Version</span> <span class="rj-ver-badge">${label}</span>`;
  }

  buildMarkdownCell(post, cellIndex) {
    const wrapper = document.createElement('div');
    wrapper.className = 'rj-cell-wrapper';
    wrapper.id = `rj-md-cell-${post.postId}`;

    const safeScore = Number(post.score || 0).toLocaleString();

    wrapper.innerHTML = `
      <div class="rj-row">
        <div class="rj-gutter"></div>
        <div class="rj-markdown-cell">
          <h1 class="rj-md-h1">${escapeHtml(post.title)}</h1>
          <div class="rj-md-meta-badges">
            <span class="rj-md-badge rj-sub-badge" title="Click to view r/${escapeHtml(post.subreddit)}" style="cursor:pointer;">📂 <b>r/${escapeHtml(post.subreddit)}</b></span>
            <span class="rj-md-badge">👤 <b>u/${escapeHtml(post.author)}</b></span>
            <span class="rj-md-badge">▲ <b>${safeScore} upvotes</b></span>
            <span class="rj-md-badge">💬 <b>${post.num_comments || 0} comments</b></span>
            <span class="rj-md-badge">🌐 ${escapeHtml(post.domain || 'self')}</span>
          </div>
        </div>
        <div class="rj-cell-actions">
          <button class="rj-cell-nav rj-cell-up">▲</button>
          <button class="rj-cell-nav rj-cell-down">▼</button>
          <button class="rj-cell-more rj-cell-del" title="Delete cell">🗑</button>
        </div>
      </div>
      <div class="rj-cell-bottom-bar">
        <button class="rj-btn-pill rj-add-code-btn">+ Code</button>
        <button class="rj-btn-pill rj-add-md-btn">+ Markdown</button>
      </div>
    `;

    const subBadge = wrapper.querySelector('.rj-sub-badge');
    if (subBadge && post.subreddit) {
      subBadge.addEventListener('click', () => {
        this.switchToSubreddit(post.subreddit);
      });
    }

    return wrapper;
  }

  buildCodeCell(post, cellIndex) {
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
            <button class="rj-cell-nav rj-cell-up">▲</button>
            <button class="rj-cell-nav rj-cell-down">▼</button>
            <button class="rj-cell-more rj-cell-del" title="Delete cell">🗑</button>
          </div>
        </div>
      </div>

      <!-- HOVER BUTTONS UNDER CELL -->
      <div class="rj-cell-bottom-bar">
        <button class="rj-btn-pill rj-add-code-btn">+ Code</button>
        <button class="rj-btn-pill rj-add-md-btn">+ Markdown</button>
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

    wrapper.querySelector('.rj-run-btn').addEventListener('click', () => this.handleRun(post, cellIndex));
    return wrapper;
  }

  async handleRun(post, cellIndex = 1) {
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
    
    this.updateStatus('Draft Session Active (Kernel running)', true);

    if (!commentOffsets[post.postId]) {
      commentOffsets[post.postId] = 0;
      await renderMedia(post, mediaEl);
    }

    if (btn) {
      btn.innerHTML = '<span class="rj-spinner"></span>';
      btn.disabled  = true;
    }

    try {
      const offset   = commentOffsets[post.postId];
      const comments = await fetchThreadComments(post.permalink, offset, 5);

      commentsEl.querySelector('.rj-load-more')?.remove();

      if (!comments || !comments.length) {
        if (offset === 0) {
          commentsEl.innerHTML = `<div class="rj-no-more">── no comments found ──</div>`;
        } else {
          commentsEl.innerHTML += `<div class="rj-no-more">── end of thread ──</div>`;
        }
        if (numEl) numEl.textContent = `[ ${cellIndex}]:`;
        if (btn) { btn.innerHTML = '▶'; btn.disabled = false; }
        this.updateStatus('Draft Session Active (Kernel ready)', true);
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
      loadMore.addEventListener('click', () => this.handleRun(post, cellIndex));
      commentsEl.appendChild(loadMore);

    } catch (err) {
      commentsEl.innerHTML += `<div class="rj-error">Error fetching comments: ${escapeHtml(err.message)}</div>`;
      if (numEl) numEl.textContent = `[ ${cellIndex}]:`;
    }

    if (btn) { btn.innerHTML = '▶'; btn.disabled = false; }
    this.updateStatus('Draft Session Active (Kernel ready)', true);
  }
}
