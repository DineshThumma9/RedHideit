// ===== REDDIT JUPY - skins/jupyter/jupyter.js =====

class JupyterSkin extends BaseSkin {
  constructor(state) {
    super('jupyter', state);
  }

  mount() {
    const sub = this.state.currentSubreddit || 'all';
    const root = document.createElement('div');
    root.id = 'rj-jupyter-root';
    this.rootElement = root;

    root.innerHTML = `
      <!-- ROW 1: JUPYTER TOP HEADER (38px) -->
      <div id="jp-header-bar">
        <div id="jp-logo-wrap" title="Jupyter Notebook">
          ${ICONS.jupyterLogo}
          <span id="jp-brand-name">Jupyter</span>
        </div>
        <div id="jp-title-group">
          <span id="jp-notebook-title" title="Rename Notebook">r_${escapeHtml(sub)}_analysis.ipynb</span>
          <span id="jp-save-status">(autosaved)</span>
        </div>
        <div id="jp-header-right">
          <label style="font-size:12px; color:#666; font-weight:500;">Skin:</label>
          <select class="jp-skin-select" id="jp-skin-switcher">
            <option value="jupyter" selected>Jupyter Notebook</option>
            <option value="kaggle"> Kaggle Notebook</option>
          </select>
          <span style="font-size:12px; color:#888;">|</span>
          <span style="font-size:12px; color:#303F9F; font-weight:600; cursor:pointer;" id="jp-open-sub-btn">Open Subreddit...</span>
        </div>
      </div>

      <!-- ROW 2: MENU BAR (28px) -->
      <div id="jp-menubar-bar">
        <span class="jp-menu-item">File</span>
        <span class="jp-menu-item">Edit</span>
        <span class="jp-menu-item">View</span>
        <span class="jp-menu-item">Insert</span>
        <span class="jp-menu-item">Cell</span>
        <span class="jp-menu-item">Kernel</span>
        <span class="jp-menu-item">Widgets</span>
        <span class="jp-menu-item">Help</span>
        <span id="jp-kernel-header-label">Python 3 (ipykernel)</span>
      </div>

      <!-- ROW 3: ACTION TOOLBAR (34px) -->
      <div id="jp-toolbar-bar">
        <button class="jp-tb-btn" id="jp-btn-save" title="Save and Checkpoint">${ICONS.save}</button>
        <button class="jp-tb-btn" id="jp-btn-add-cell" title="Insert cell below">${ICONS.plus}</button>
        <button class="jp-tb-btn" title="Cut selected cells">${ICONS.cut}</button>
        <button class="jp-tb-btn" title="Copy selected cells">${ICONS.copy}</button>
        <button class="jp-tb-btn" title="Paste cells below">${ICONS.paste}</button>
        <div class="jp-tb-sep"></div>
        <button class="jp-tb-btn" id="jp-btn-up" title="Move cell up">${ICONS.chevronUp}</button>
        <button class="jp-tb-btn" id="jp-btn-down" title="Move cell down">${ICONS.chevron}</button>
        <div class="jp-tb-sep"></div>
        <button class="jp-tb-btn jp-tb-run-btn" id="jp-btn-run" title="Run the selected cells and advance">${ICONS.play} Run</button>
        <button class="jp-tb-btn" id="jp-btn-interrupt" title="Interrupt kernel">${ICONS.stop}</button>
        <button class="jp-tb-btn" id="jp-btn-restart" title="Restart kernel">${ICONS.refresh}</button>
        <button class="jp-tb-btn" id="jp-btn-restart-runall" title="Restart and run all cells">${ICONS.fastForward}</button>
        <div class="jp-tb-sep"></div>
        <select class="jp-tb-dropdown" id="jp-cell-type-dropdown">
          <option value="code" selected>Code</option>
          <option value="markdown">Markdown</option>
          <option value="raw">Raw NBConvert</option>
          <option value="heading">Heading</option>
        </select>
        <div class="jp-tb-sep"></div>
        <button class="jp-tb-btn" title="Open command palette">${ICONS.keyboard}</button>

        <div id="jp-toolbar-right">
          <div class="jp-kernel-status">
            <span class="jp-kernel-dot" id="jp-kernel-dot"></span>
            <span id="jp-kernel-label">Kernel: Idle</span>
          </div>
        </div>
      </div>

      <!-- NOTEBOOK CANVAS (Gray outer background + Centered Paper Sheet) -->
      <div id="jp-notebook-canvas">
        <div id="jp-notebook-container">
          
          <!-- Environment Setup Cell -->
          <div class="jp-cell jp-cell-active" id="jp-cell-setup">
            <div class="jp-input-row">
              <div class="jp-prompt jp-in-prompt">In [ 1 ]:</div>
              <div class="jp-input-area">
                <span class="rj-code-line"><span class="rj-kw">import</span> <span class="rj-var">pandas</span> <span class="rj-kw">as</span> <span class="rj-var">pd</span></span>
                <span class="rj-code-line"><span class="rj-kw">import</span> <span class="rj-var">numpy</span> <span class="rj-kw">as</span> <span class="rj-var">np</span></span>
                <span class="rj-code-line"><span class="rj-kw">import</span> <span class="rj-var">requests</span></span>
                <span class="rj-code-blank"></span>
                <span class="rj-code-line"><span class="rj-func">print</span>(<span class="rj-str">"⚡ Jupyter Kernel Ready. Pipeline Loaded."</span>)</span>
              </div>
            </div>
            <div class="jp-output-row" style="margin-top:6px;">
              <div class="jp-prompt jp-out-prompt">Out[ 1 ]:</div>
              <div class="jp-output-area">
                <pre class="jp-output-console">⚡ Jupyter Kernel Ready. Pipeline Loaded.</pre>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- JUPYTER SUBREDDIT / DATASET SEARCH MODAL -->
      <div id="jp-modal-overlay" class="hidden">
        <div id="jp-modal-card">
          <div id="jp-modal-header">
            <span>Open Subreddit Dataset</span>
            <button id="jp-modal-close-btn" style="background:none; border:none; font-size:16px; cursor:pointer;">✕</button>
          </div>
          <div style="padding:14px 18px 6px 18px;">
            <input type="text" id="jp-modal-search-input" placeholder="Search subreddits (e.g. datascience, python, all)..." />
          </div>
          <div id="jp-modal-results">
            <div style="color:#777; padding:12px 0; text-align:center;">Type a subreddit name to search datasets...</div>
          </div>
        </div>
      </div>
    `;

    // Render cells
    this.renderPosts(this.state.posts);

    // Setup Pagination "Load More" cell
    this.setupPaginationCell();

    // Attach Cell Listeners and Keyboard Shortcuts
    this.setupCellListeners();

    // Attach Header, Modal, and Switcher Handlers
    this.setupUIHandlers();

    document.body.appendChild(root);
  }

  renderPosts(posts) {
    const container = this.rootElement.querySelector('#jp-notebook-container');
    if (!container) return;

    // Clear existing post cells if rebuilding (keep setup cell)
    const existing = container.querySelectorAll('.jp-post-cell');
    existing.forEach(el => el.remove());

    this.appendPosts(posts);
  }

  appendPosts(newPosts) {
    const container = this.rootElement.querySelector('#jp-notebook-container');
    const paginationCell = this.rootElement.querySelector('#jp-pagination-cell');

    newPosts.forEach((post) => {
      const cellIdx = executionCounter++;

      // 1. Markdown cell
      const mdCell = this.buildMarkdownCell(post, cellIdx);
      mdCell.classList.add('jp-post-cell');

      // 2. Python Code cell
      const codeCell = this.buildCodeCell(post, cellIdx + 1);
      codeCell.classList.add('jp-post-cell');

      if (paginationCell && paginationCell.parentNode === container) {
        container.insertBefore(mdCell, paginationCell);
        container.insertBefore(codeCell, paginationCell);
      } else {
        container.appendChild(mdCell);
        container.appendChild(codeCell);
      }
    });
  }

  updateStatus(statusText, isBusy = false) {
    const label = document.getElementById('jp-kernel-label');
    const dot = document.getElementById('jp-kernel-dot');
    if (label) label.textContent = statusText;
    if (dot) dot.classList.toggle('busy', isBusy);
  }

  buildMarkdownCell(post, cellIndex) {
    const wrapper = document.createElement('div');
    wrapper.className = 'jp-cell';
    wrapper.id = `jp-md-${post.postId}`;

    const safeScore = Number(post.score || 0).toLocaleString();

    wrapper.innerHTML = `
      <div class="jp-input-row">
        <div class="jp-prompt"></div>
        <div class="jp-markdown-card">
          <h2 class="jp-md-title">${escapeHtml(post.title)}</h2>
          <div class="jp-md-meta">
            <span class="jp-badge jp-sub-badge" title="Click to view r/${escapeHtml(post.subreddit)}">📂 r/${escapeHtml(post.subreddit)}</span>
            <span class="jp-badge">👤 u/${escapeHtml(post.author)}</span>
            <span class="jp-badge">▲ ${safeScore} upvotes</span>
            <span class="jp-badge">💬 ${post.num_comments || 0} comments</span>
            <span class="jp-badge">🌐 ${escapeHtml(post.domain || 'self')}</span>
          </div>
        </div>
      </div>
    `;

    const subBadge = wrapper.querySelector('.jp-sub-badge');
    if (subBadge && post.subreddit) {
      subBadge.addEventListener('click', () => {
        this.switchToSubreddit(post.subreddit);
      });
    }

    return wrapper;
  }

  buildCodeCell(post, cellIndex) {
    const wrapper = document.createElement('div');
    wrapper.className = 'jp-cell';
    wrapper.id = `jp-cell-${post.postId}`;

    wrapper.innerHTML = `
      <!-- INPUT ROW -->
      <div class="jp-input-row">
        <div class="jp-prompt jp-in-prompt">In [ ${cellIndex} ]:</div>
        <div class="jp-input-area">
          <span class="rj-code-line"><span class="rj-kw">import</span> <span class="rj-var">pandas</span> <span class="rj-kw">as</span> <span class="rj-var">pd</span></span>
          <span class="rj-code-line rj-code-comment"># Extract thread discussions for ID: ${post.postId}</span>
          <span class="rj-code-line"><span class="rj-var">thread_df</span> <span class="rj-op">=</span> <span class="rj-var">pd</span>.<span class="rj-func">read_json</span>(<span class="rj-str">"https://old.reddit.com${post.permalink}.json"</span>)</span>
          <span class="rj-code-line"><span class="rj-func">print</span>(<span class="rj-str">"Loaded discussions for r/${escapeHtml(post.subreddit)}"</span>)</span>
        </div>
      </div>

      <!-- OUTPUT ROW -->
      <div class="jp-output-row" id="jp-out-row-${post.postId}" style="display:none; margin-top:6px;">
        <div class="jp-prompt jp-out-prompt">Out[ ${cellIndex} ]:</div>
        <div class="jp-output-area">
          <div class="rj-media-wrap" id="jp-media-${post.postId}"></div>
          <div class="jp-comments-wrap" id="jp-comments-${post.postId}"></div>
        </div>
      </div>
    `;

    return wrapper;
  }

  async handleRun(post, cellIndex = 1) {
    const outRow     = document.getElementById(`jp-out-row-${post.postId}`);
    const mediaEl    = document.getElementById(`jp-media-${post.postId}`);
    const commentsEl = document.getElementById(`jp-comments-${post.postId}`);
    const wrapper    = document.getElementById(`jp-cell-${post.postId}`);
    const promptEl   = wrapper?.querySelector('.jp-in-prompt');

    if (!outRow) return;

    outRow.style.display = 'flex';
    if (promptEl) promptEl.textContent = `In [ * ]:`;
    this.updateStatus('Kernel: Busy', true);

    if (!commentOffsets[post.postId]) {
      commentOffsets[post.postId] = 0;
      await renderMedia(post, mediaEl);
    }

    try {
      const offset = commentOffsets[post.postId];
      const comments = await fetchThreadComments(post.permalink, offset, 5);

      commentsEl.querySelector('.jp-load-more-btn')?.remove();

      if (!comments || !comments.length) {
        if (offset === 0) {
          commentsEl.innerHTML = `<div style="color:#777; font-size:12px;">── no comments found ──</div>`;
        } else {
          commentsEl.innerHTML += `<div style="color:#777; font-size:12px; margin-top:6px;">── end of thread ──</div>`;
        }
        if (promptEl) promptEl.textContent = `In [ ${cellIndex} ]:`;
        this.updateStatus('Kernel: Idle', false);
        return;
      }

      comments.forEach(c => {
        const div = document.createElement('div');
        div.className = 'jp-comment';
        div.innerHTML = `
          <div class="jp-comment-author">u/${escapeHtml(c.author)} <span style="font-weight:400; color:#666;">▲ ${Number(c.score || 0).toLocaleString()}</span></div>
          <div class="jp-comment-body">${escapeHtml(c.body)}</div>
        `;
        commentsEl.appendChild(div);
      });

      commentOffsets[post.postId] += comments.length;
      if (promptEl) promptEl.textContent = `In [ ${cellIndex} ]:`;

      const loadMore = document.createElement('button');
      loadMore.className = 'jp-load-more-btn';
      loadMore.textContent = '▶ Load more comments';
      loadMore.addEventListener('click', () => this.handleRun(post, cellIndex));
      commentsEl.appendChild(loadMore);

    } catch (err) {
      commentsEl.innerHTML += `<div style="color:#c62828;">Error fetching comments: ${escapeHtml(err.message)}</div>`;
      if (promptEl) promptEl.textContent = `In [ ${cellIndex} ]:`;
    }

    this.updateStatus('Kernel: Idle', false);
  }

  setupPaginationCell() {
    const container = this.rootElement.querySelector('#jp-notebook-container');
    const wrapper = document.createElement('div');
    wrapper.className = 'jp-cell';
    wrapper.id = 'jp-pagination-cell';

    wrapper.innerHTML = `
      <div class="jp-input-row">
        <div class="jp-prompt jp-in-prompt">[ ⤓ ]:</div>
        <div class="jp-input-area" style="display:flex; justify-content:space-between; align-items:center;">
          <span class="rj-code-line"><span class="rj-kw">def</span> <span class="rj-func">fetch_next_batch</span>(<span class="rj-var">limit</span>=<span class="rj-str">25</span>): <span class="rj-code-comment"># Press Shift+Enter to fetch next 25 posts</span></span>
          <button class="jp-tb-btn" id="jp-btn-fetch-more" style="font-weight:600; cursor:pointer;">Fetch Next 25 Posts</button>
        </div>
      </div>
    `;

    const loadNext = async () => {
      if (this.state.isLoading) return;
      this.state.isLoading = true;
      const btn = wrapper.querySelector('#jp-btn-fetch-more');
      if (btn) btn.textContent = 'Fetching posts...';
      this.updateStatus('Kernel: Busy', true);

      try {
        const morePosts = await fetchSubredditPosts(this.state.currentSubreddit, this.state.afterToken, 25);
        if (morePosts.length > 0) {
          this.state.posts = this.state.posts.concat(morePosts);
          this.appendPosts(morePosts);
        }
      } catch (err) {
        console.error('Failed to paginate:', err);
      } finally {
        this.state.isLoading = false;
        if (btn) btn.textContent = 'Fetch Next 25 Posts';
        this.updateStatus('Kernel: Idle', false);
      }
    };

    wrapper.querySelector('#jp-btn-fetch-more')?.addEventListener('click', loadNext);
    container.appendChild(wrapper);
  }

  setupCellListeners() {
    // 1. Click to activate cell
    this.rootElement.addEventListener('click', (e) => {
      const cell = e.target.closest('.jp-cell');
      if (cell) {
        document.querySelectorAll('.jp-cell').forEach(c => c.classList.remove('jp-cell-active'));
        cell.classList.add('jp-cell-active');
      }
    });

    // 2. Global Keyboard Shortcuts (Shift+Enter / Ctrl+Enter)
    document.addEventListener('keydown', (e) => {
      if (this.state.activeSkin !== 'jupyter') return;

      if ((e.shiftKey && e.key === 'Enter') || ((e.ctrlKey || e.metaKey) && e.key === 'Enter')) {
        e.preventDefault();

        let currentCell = document.querySelector('.jp-cell.jp-cell-active');
        if (!currentCell) {
          currentCell = document.querySelector('.jp-cell');
        }

        if (currentCell) {
          // If custom code cell textarea, evaluate
          const customTextarea = currentCell.querySelector('.jp-code-editor-input');
          if (customTextarea) {
            const outRow = currentCell.querySelector('.jp-output-row');
            const outPre = currentCell.querySelector('.jp-output-console');
            const prompt = currentCell.querySelector('.jp-in-prompt');
            if (outRow && outPre) {
              outRow.style.display = 'flex';
              if (prompt) prompt.textContent = `In [ * ]:`;
              this.updateStatus('Kernel: Busy', true);
              setTimeout(() => {
                const code = customTextarea.value.trim() || 'print("Hello Jupyter!")';
                let result = '';
                if (code.includes('print(')) {
                  const m = code.match(/print\((['"]?)(.*?)\1\)/);
                  result = m ? m[2] : 'Executed successfully.';
                } else {
                  result = `Evaluated: ${code}`;
                }
                outPre.textContent = result;
                if (prompt) prompt.textContent = `In [ ${executionCounter++} ]:`;
                this.updateStatus('Kernel: Idle', false);
              }, 300);
            }
          } else {
            // Find post ID and run
            const postId = currentCell.id.replace('jp-cell-', '').replace('jp-md-', '');
            const post = this.state.posts.find(p => p.postId === postId);
            if (post) {
              this.handleRun(post);
            }
          }

          // Advance to next cell on Shift+Enter
          if (e.shiftKey) {
            let nextCell = currentCell.nextElementSibling;
            while (nextCell && (!nextCell.classList.contains('jp-cell') || nextCell.id === 'jp-pagination-cell')) {
              if (nextCell.id === 'jp-pagination-cell') {
                nextCell.querySelector('#jp-btn-fetch-more')?.click();
                break;
              }
              nextCell = nextCell.nextElementSibling;
            }

            if (nextCell && nextCell.classList.contains('jp-cell')) {
              document.querySelectorAll('.jp-cell').forEach(c => c.classList.remove('jp-cell-active'));
              nextCell.classList.add('jp-cell-active');
              nextCell.scrollIntoView({ behavior: 'smooth', block: 'center' });
              const nextInput = nextCell.querySelector('textarea');
              if (nextInput) nextInput.focus();
            }
          }
        }
      }
    });
  }

  setupUIHandlers() {
    // Toolbar buttons
    this.rootElement.querySelector('#jp-btn-run')?.addEventListener('click', () => {
      const activeCell = document.querySelector('.jp-cell.jp-cell-active');
      if (activeCell) {
        const postId = activeCell.id.replace('jp-cell-', '').replace('jp-md-', '');
        const post = this.state.posts.find(p => p.postId === postId);
        if (post) this.handleRun(post);
      }
    });

    this.rootElement.querySelector('#jp-btn-add-cell')?.addEventListener('click', () => {
      this.createEmptyCodeCell();
    });

    this.rootElement.querySelector('#jp-btn-restart')?.addEventListener('click', () => {
      this.updateStatus('Kernel: Restarting...', true);
      setTimeout(() => this.updateStatus('Kernel: Idle', false), 1000);
    });

    // Skin Switcher Dropdown
    const skinSelect = this.rootElement.querySelector('#jp-skin-switcher');
    skinSelect?.addEventListener('change', (e) => {
      window.switchSkin(e.target.value);
    });

    // Subreddit Search Modal
    this.setupSearchModal();
  }

  createEmptyCodeCell() {
    const container = this.rootElement.querySelector('#jp-notebook-container');
    const paginationCell = this.rootElement.querySelector('#jp-pagination-cell');
    const cellIdx = executionCounter++;
    const wrapper = document.createElement('div');
    wrapper.className = 'jp-cell jp-cell-active';

    wrapper.innerHTML = `
      <div class="jp-input-row">
        <div class="jp-prompt jp-in-prompt">In [   ]:</div>
        <div class="jp-input-area">
          <textarea class="jp-code-editor-input" placeholder="# Type Python code here...&#10;print('Hello Jupyter!')" rows="2"></textarea>
        </div>
      </div>
      <div class="jp-output-row" style="display:none; margin-top:6px;">
        <div class="jp-prompt jp-out-prompt">Out[ ${cellIdx} ]:</div>
        <div class="jp-output-area">
          <pre class="jp-output-console"></pre>
        </div>
      </div>
    `;

    document.querySelectorAll('.jp-cell').forEach(c => c.classList.remove('jp-cell-active'));

    if (paginationCell) {
      container.insertBefore(wrapper, paginationCell);
    } else {
      container.appendChild(wrapper);
    }

    const textarea = wrapper.querySelector('textarea');
    textarea.focus();
    wrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  setupSearchModal() {
    const modal = this.rootElement.querySelector('#jp-modal-overlay');
    const closeBtn = this.rootElement.querySelector('#jp-modal-close-btn');
    const inputEl = this.rootElement.querySelector('#jp-modal-search-input');
    const resultsEl = this.rootElement.querySelector('#jp-modal-results');
    const openBtn = this.rootElement.querySelector('#jp-open-sub-btn');

    const openModal = () => {
      modal.classList.remove('hidden');
      inputEl.value = '';
      inputEl.focus();
    };

    const closeModal = () => {
      modal.classList.add('hidden');
    };

    openBtn?.addEventListener('click', openModal);
    closeBtn?.addEventListener('click', closeModal);
    modal?.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    let searchTimeout = null;
    inputEl?.addEventListener('input', () => {
      clearTimeout(searchTimeout);
      const query = inputEl.value.trim();
      if (!query) {
        resultsEl.innerHTML = `<div style="color:#777; padding:12px 0; text-align:center;">Type a subreddit name to search datasets...</div>`;
        return;
      }

      resultsEl.innerHTML = `<div style="color:#777; padding:12px 0; text-align:center;">Searching datasets...</div>`;

      searchTimeout = setTimeout(async () => {
        const results = await searchSubreddits(query);
        if (!results || !results.length) {
          resultsEl.innerHTML = `<div style="color:#777; padding:12px 0; text-align:center;">No subreddits found matching "${escapeHtml(query)}"</div>`;
          return;
        }

        resultsEl.innerHTML = '';
        results.forEach(sub => {
          const item = document.createElement('div');
          item.className = 'jp-modal-result-item';
          const subsFormatted = Number(sub.subscribers || 0).toLocaleString();
          item.innerHTML = `
            <div>
              <div style="font-weight:700; color:#303F9F; font-size:13px;">r/${escapeHtml(sub.name)}</div>
              <div style="font-size:12px; color:#555;">${escapeHtml(sub.title || sub.description || '')}</div>
            </div>
            <div style="font-size:11.5px; color:#777; font-family:monospace;">${subsFormatted} members</div>
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

    const titleEl = this.rootElement.querySelector('#jp-notebook-title');
    if (titleEl) titleEl.textContent = `r_${subredditName}_analysis.ipynb`;
    this.updateStatus(`Loading r/${subredditName}...`, true);

    try {
      const posts = await fetchSubredditPosts(subredditName, null, 25);
      this.state.posts = posts;
      this.renderPosts(posts);
    } catch (err) {
      console.error('Error switching subreddit in Jupyter:', err);
    } finally {
      this.state.isLoading = false;
      this.updateStatus('Kernel: Idle', false);
    }
  }
}
