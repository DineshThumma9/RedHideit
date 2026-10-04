// ===== REDDIT JUPY - content.js (Kaggle 1:1 exact clone) =====

const isOldReddit  = location.hostname === 'old.reddit.com';
const commentOffsets = {};
let executionCounter = 1;



const State = {
  currentSubreddit: 'all',
  afterToken:null,
  posts:[],
  isLoading:false,
};




async function fetchSubredditPosts(subreddit,afterToken=null,limit=25){



  try {

    const url = `https://old.reddit.com/r/${subreddit}.json?limit=${limit}${afterToken ? `&after=${afterToken}` : ''}`

  const response = await fetch(url);

  if(!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }


  const data = await response.json();
  State.afterToken = data.data.after 

  const posts = data.data.children.map(post => {
    const p = post.data;
    return {
      postId: p.id,
      title: p.title,
      author: p.author,
      score: p.score,
      url: p.url,
      permalink: p.permalink,
      domain: p.domain,
      subreddit: p.subreddit,
      thumbnail: p.thumbnail,
      num_comments: p.num_comments,
      media: p.media,
      secure_media: p.secure_media,
      preview: p.preview,
      crosspost_parent_list: p.crosspost_parent_list,
      selftext: p.selftext,
    };
  });

  return posts;



  } catch (err) {
    console.error('Failed to fetch posts:' , err);
    return [];
  }

  
}



async function searchSubreddits(query){


  try {

    
    const results = await fetch(`https://old.reddit.com/subreddits/search.json?q=${encodeURIComponent(query)}&limit=10`);
    if(!results.ok) {
      throw new Error(`HTTP ${results.status}`);
    }
    const json = await results.json();


    return (json.data?.children || []).map(sub => ({

        name:sub.data.display_name,
        title:sub.data.title,
        subscribers:sub.data.subscribers,
        description:sub.data.public_description

    }));

  }

  catch (err){

    console.error('Searched failed:' , err);
    return [];

  }

    
}




async function fetchThreadComments(permalink,offset=0,limit=5){

  try {
  
const url = `https://old.reddit.com${permalink}.json?limit=50`;
  const res  = await fetch(url);
  if(!res.ok) {
    throw Error(`HTTP status code : ${res.status}`);
  }
  const json = await res.json();
  const commentTree = json[1]?.data?.children || [];
  const filteredComments = commentTree.filter(c => c.kind == 't1' && c.data?.body)
                                        .slice(offset,offset+limit)
                                        .map(c => ({
                                          author:c.data.author,
                                          body:c.data.body,
                                          score:c.data.score
                                        }));
    

  return filteredComments;


  }

  catch (err) {
    console.error("Failed to fetch comments:", err);
    return [];

  }
}
if (document.readyState === 'complete') {
  init();
} else {
  window.addEventListener('load', init);
}

function init() {
  if (isOldReddit) {
    const posts = readOldRedditPosts();
    if (!posts.length) return;
    State.currentSubreddit = posts[0]?.subreddit || 'all';
    State.posts = posts;
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
      index:        i + 1,
      postId:       el.getAttribute('data-fullname')?.replace('t3_', '') || `post_${i}`,
      title:        titleEl?.textContent?.trim() || 'Untitled',
      author:       el.getAttribute('data-author')    || 'unknown',
      subreddit:    el.getAttribute('data-subreddit') || 'all',
      score:        el.getAttribute('data-score')     || '0',
      url:          el.getAttribute('data-url')       || '',
      permalink:    el.getAttribute('data-permalink') || '',
      domain:       el.getAttribute('data-domain')    || '',
      num_comments: el.getAttribute('data-comments-count') || 0,
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
  play:      `<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`,
  people:    `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>`,
  update:    `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M21 10.12h-6.78l2.74-2.82c-2.73-2.7-7.15-2.8-9.88-.1-2.73 2.71-2.73 7.08 0 9.79s7.15 2.71 9.88 0C18.32 15.65 19 14.08 19 12.1h2c0 1.98-.88 4.55-2.64 6.29-3.51 3.48-9.21 3.48-12.72 0-3.5-3.47-3.53-9.11-.02-12.58s9.14-3.47 12.65 0L21 3v7.12zM12.5 8v4.25l3.5 2.08-.72 1.21L11 13V8h1.5z"/></svg>`,
  folder:    `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 7v13a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-6l-2-2H5a2 2 0 0 0-2 2z"/></svg>`,
  file:      `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/></svg>`,
  chevron:   `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/></svg>`,
  chevronUp: `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/></svg>`,
  upload:    `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/></svg>`,
  settings:  `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>`,
  notebook:  `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-8L4 8v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2zm0 18H6V9h5V4h7v16z"/></svg>`,
  power:     `<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z"/></svg>`,
  refresh:   `<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>`,
  more:      `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>`,
};

// ─── BUILD NOTEBOOK ──────────────────────────────────────
function buildNotebook(posts) {
  const sub      = State.currentSubreddit || posts[0]?.subreddit || 'all';
  const notebook = document.createElement('div');
  notebook.id    = 'rj-notebook';

  notebook.innerHTML = `
    <!-- ROW 1: TOP HEADER (Full Width Header with Share & Save Version 0) -->
    <div id="rj-top-header">
      <div id="rj-title-group">
        <span id="rj-nb-icon">🛒</span>
        <span id="rj-nb-title">r/${escapeHtml(sub)}: Reddit Community &amp; Data Pipeline Analysis</span>
        <span id="rj-nb-draft">Draft saved</span>
      </div>
      <div id="rj-top-header-right">
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
                <span id="rj-panel-csv-name">${escapeHtml(sub)}_posts (${posts.length} rows).csv</span>
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
  renderPostCellsAndTOC(posts, notebook);

  // Setup Pagination "Load More" cell
  setupPaginationCell(notebook);

  // Attach global cell actions (Add cell, Reorder, Delete)
  setupCellListeners(notebook);

  // Panel toggle
  const panel    = notebook.querySelector('#rj-notebook-panel');
  const tab      = notebook.querySelector('#rj-panel-tab');
  const tbToggle = notebook.querySelector('#rj-nb-toggle-btn');

  function togglePanel() {
    const isClosed = panel.classList.toggle('closed');
    tab.classList.toggle('panel-closed', isClosed);
    tab.innerHTML = isClosed ? '◀' : '▶';
  }

  tab.addEventListener('click', togglePanel);
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
    State.posts.slice(0, 5).forEach((p, idx) => {
      setTimeout(() => handleRun(p), idx * 600);
    });
  });

  // Run first cell
  notebook.querySelector('#rj-tb-run-first')?.addEventListener('click', () => {
    if (State.posts[0]) handleRun(State.posts[0]);
  });

  // Top toolbar + button to add empty code cell at bottom/top
  notebook.querySelector('#rj-tb-add-cell')?.addEventListener('click', () => {
    createEmptyCodeCell(null);
  });
  notebook.querySelector('#rj-nav-add-cell')?.addEventListener('click', () => {
    createEmptyCodeCell(null);
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

  // Wire Modal Events
  setupSearchModal(notebook);

  document.body.appendChild(notebook);
}

// ─── RENDER POST CELLS & TOC ─────────────────────────────
function renderPostCellsAndTOC(posts, notebookEl = document) {
  const cellsEl = notebookEl.querySelector('#rj-cells');
  const tocList = notebookEl.querySelector('#rj-toc-list');
  if (!cellsEl || !tocList) return;

  // Clear existing items if rebuilding (keep setup cell)
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

  appendPostCells(posts, notebookEl);
}

// ─── APPEND POST CELLS (Used for Initial & Pagination) ───
function appendPostCells(newPosts, notebookEl = document) {
  const cellsEl = notebookEl.querySelector('#rj-cells');
  const tocList = notebookEl.querySelector('#rj-toc-list');
  const paginationCell = notebookEl.querySelector('#rj-pagination-cell');

  newPosts.forEach((post, i) => {
    const cellIdx = executionCounter++;
    // 1. Markdown cell
    const mdWrapper = buildMarkdownCell(post, cellIdx);
    mdWrapper.classList.add('rj-post-cell-wrapper');

    // 2. Python Code cell
    const codeWrapper = buildCodeCell(post, cellIdx + 1);
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
    ti.innerHTML = `<span>🛒</span> <span>${escapeHtml(post.title.slice(0, 36))}${post.title.length > 36 ? '…' : ''}</span>`;
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

// ─── SETUP PAGINATION CELL ───────────────────────────────
function setupPaginationCell(notebookEl) {
  const cellsEl = notebookEl.querySelector('#rj-cells');
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

  async function loadNext() {
    if (State.isLoading) return;
    State.isLoading = true;
    const runBtn = wrapper.querySelector('#rj-btn-fetch-more');
    const pillBtn = wrapper.querySelector('#rj-btn-fetch-more-pill');
    if (runBtn) runBtn.innerHTML = '<span class="rj-spinner"></span>';
    if (pillBtn) pillBtn.textContent = 'Fetching posts...';

    document.getElementById('rj-session-label').textContent = 'Draft Session Active (Fetching next batch...)';
    document.getElementById('rj-status-dot').classList.add('active');

    try {
      const morePosts = await fetchSubredditPosts(State.currentSubreddit, State.afterToken, 25);
      if (morePosts.length > 0) {
        State.posts = State.posts.concat(morePosts);
        appendPostCells(morePosts);
        // Update dataset row count in right panel
        const csvName = document.getElementById('rj-panel-csv-name');
        if (csvName) csvName.textContent = `${State.currentSubreddit}_posts (${State.posts.length} rows).csv`;
      }
    } catch (err) {
      console.error('Failed to paginate:', err);
    } finally {
      State.isLoading = false;
      if (runBtn) runBtn.innerHTML = '▶';
      if (pillBtn) pillBtn.textContent = 'Fetch Next 25 Posts';
      document.getElementById('rj-session-label').textContent = 'Draft Session Active (Kernel ready)';
    }
  }

  wrapper.querySelector('#rj-btn-fetch-more').addEventListener('click', loadNext);
  wrapper.querySelector('#rj-btn-fetch-more-pill').addEventListener('click', loadNext);

  cellsEl.appendChild(wrapper);
}

// ─── SETUP SEARCH MODAL ("ADD INPUT") ─────────────────────
function setupSearchModal(notebookEl) {
  const modal = notebookEl.querySelector('#rj-modal-overlay');
  const closeBtn = notebookEl.querySelector('#rj-modal-close-btn');
  const inputEl = notebookEl.querySelector('#rj-modal-search-input');
  const resultsEl = notebookEl.querySelector('#rj-modal-results');
  const addInputBtn = notebookEl.querySelector('#rj-btn-add-input');
  const navDatasetsBtn = notebookEl.querySelector('#rj-nav-datasets');

  function openModal() {
    modal.classList.remove('hidden');
    inputEl.value = '';
    inputEl.focus();
  }

  function closeModal() {
    modal.classList.add('hidden');
  }

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
          await switchToSubreddit(sub.name);
        });
        resultsEl.appendChild(item);
      });
    }, 300);
  });
}

// ─── SWITCH SUBREDDIT ─────────────────────────────────────
async function switchToSubreddit(subredditName) {
  State.currentSubreddit = subredditName;
  State.afterToken = null;
  State.isLoading = true;

  document.getElementById('rj-nb-title').textContent = `r/${subredditName}: Reddit Community & Data Pipeline Analysis`;
  document.getElementById('rj-panel-feed-name').textContent = `r/${subredditName}_feed`;
  document.getElementById('rj-session-label').textContent = `Draft Session Active (Loading r/${subredditName}...)`;
  document.getElementById('rj-status-dot').classList.add('active');

  try {
    const posts = await fetchSubredditPosts(subredditName, null, 25);
    State.posts = posts;
    renderPostCellsAndTOC(posts);
    const csvName = document.getElementById('rj-panel-csv-name');
    if (csvName) csvName.textContent = `${subredditName}_posts (${posts.length} rows).csv`;
  } catch (err) {
    console.error('Error switching subreddit:', err);
  } finally {
    State.isLoading = false;
    document.getElementById('rj-session-label').textContent = 'Draft Session Active (Kernel ready)';
  }
}

// ─── SETUP CELL ACTIONS & LISTENERS ──────────────────────
function setupCellListeners(container) {
  container.addEventListener('click', (e) => {
    const addCodeBtn = e.target.closest('.rj-add-code-btn');
    if (addCodeBtn) {
      const parentCell = addCodeBtn.closest('.rj-cell-wrapper');
      createEmptyCodeCell(parentCell);
      return;
    }

    const addMdBtn = e.target.closest('.rj-add-md-btn');
    if (addMdBtn) {
      const parentCell = addMdBtn.closest('.rj-cell-wrapper');
      createEmptyMarkdownCell(parentCell);
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
}

// ─── CREATE EMPTY CODE CELL ──────────────────────────────
function createEmptyCodeCell(afterElement) {
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
    document.getElementById('rj-session-label').textContent = 'Draft Session Active (Kernel running)';
    document.getElementById('rj-status-dot').classList.add('active');

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
      document.getElementById('rj-session-label').textContent = 'Draft Session Active (Kernel ready)';
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

// ─── CREATE EMPTY MARKDOWN CELL ──────────────────────────
function createEmptyMarkdownCell(afterElement) {
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

// ─── THEME TOGGLE ────────────────────────────────────────
let currentTheme = 'dark';
function toggleTheme() {
  const themes = ['dark', 'kaggle'];
  const idx = themes.indexOf(currentTheme);
  currentTheme = themes[(idx + 1) % themes.length];
  document.documentElement.setAttribute('data-theme', currentTheme);
  const label = currentTheme === 'dark' ? '0' : 'Light';
  document.querySelector('#rj-theme-toggle').innerHTML =
    `${ICONS.update} <span>Save Version</span> <span class="rj-ver-badge">${label}</span>`;
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
        <h2 class="rj-md-h2">🎯 Objective</h2>
        <p class="rj-md-desc">
          In this session, we analyze community thread dynamics, sentiment patterns, and user responses from <b>r/${escapeHtml(post.subreddit)}</b>.
        </p>
        <div class="rj-md-meta-badges">
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
    await renderMedia(post, mediaEl);
  }

  if (btn) {
    btn.innerHTML = '<span class="rj-spinner"></span>';
    btn.disabled  = true;
  }

  try {
    const offset   = commentOffsets[post.postId];
    // Uses the user's backend fetchThreadComments function
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

// ─── RENDER MEDIA ────────────────────────────────────────
async function renderMedia(post, el) {
  if (!el) return;
  const url = post.url || '';

  // 1. Direct Reddit Video (v.redd.it)
  let redditVideoUrl = post.secure_media?.reddit_video?.fallback_url ||
                       post.media?.reddit_video?.fallback_url ||
                       post.preview?.reddit_video_preview?.fallback_url ||
                       post.crosspost_parent_list?.[0]?.secure_media?.reddit_video?.fallback_url ||
                       post.crosspost_parent_list?.[0]?.media?.reddit_video?.fallback_url;

  if (!redditVideoUrl && (url.includes('v.redd.it') || post.isVideo)) {
    try {
      if (post.permalink) {
        const res = await fetch(`https://old.reddit.com${post.permalink}.json?limit=1`);
        if (res.ok) {
          const data = await res.json();
          const opPost = data[0]?.data?.children?.[0]?.data;
          redditVideoUrl = opPost?.secure_media?.reddit_video?.fallback_url ||
                           opPost?.media?.reddit_video?.fallback_url ||
                           opPost?.preview?.reddit_video_preview?.fallback_url ||
                           opPost?.crosspost_parent_list?.[0]?.secure_media?.reddit_video?.fallback_url;
        }
      }
    } catch (e) {
      console.warn('Could not fetch rich video metadata:', e);
    }
  }

  if (redditVideoUrl) {
    el.innerHTML = `
      <video controls playsinline preload="metadata" style="width:100%; max-height:450px; background:#000;">
        <source src="${escapeHtml(redditVideoUrl)}" type="video/mp4">
        Your browser does not support the video tag.
      </video>
    `;
    return;
  }

  // 2. YouTube Embeds
  const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (ytMatch && ytMatch[1]) {
    el.innerHTML = `
      <iframe width="100%" height="360" src="https://www.youtube.com/embed/${escapeHtml(ytMatch[1])}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="border-radius:6px;"></iframe>
    `;
    return;
  }

  // 3. Streamable Embeds
  const streamableMatch = url.match(/streamable\.com\/([a-zA-Z0-9]+)/i);
  if (streamableMatch && streamableMatch[1]) {
    el.innerHTML = `
      <iframe src="https://streamable.com/e/${escapeHtml(streamableMatch[1])}" width="100%" height="360" frameborder="0" allowfullscreen style="border-radius:6px;"></iframe>
    `;
    return;
  }

  // 4. Imgur / RedGifs / Gfycat / Direct Video Files (.mp4, .webm, .gifv)
  if (/\.(mp4|webm)(\?.*)?$/i.test(url)) {
    el.innerHTML = `<video controls playsinline preload="metadata" style="width:100%; max-height:450px;"><source src="${escapeHtml(url)}" type="video/mp4"></video>`;
    return;
  }
  if (/\.gifv?$/i.test(url)) {
    const mp4Url = url.replace(/\.gifv?$/i, '.mp4');
    el.innerHTML = `<video controls autoplay loop muted playsinline style="width:100%; max-height:450px;"><source src="${escapeHtml(mp4Url)}" type="video/mp4"></video>`;
    return;
  }

  // 5. Images (i.redd.it, imgur, png, jpg, gif, webp)
  if (/\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(url) || url.includes('i.redd.it') || (url.includes('imgur.com') && !url.includes('/a/'))) {
    el.innerHTML = `<img src="${escapeHtml(url)}" alt="" loading="lazy">`;
    return;
  }

  // 6. Text Post Selftext preview if available
  if (post.selftext && post.selftext.trim()) {
    el.innerHTML = `
      <div style="background:var(--page-bg); border:1px solid var(--border); border-radius:6px; padding:12px 14px; font-size:13px; color:var(--text-primary); max-height:300px; overflow-y:auto; white-space:pre-wrap;">
        ${escapeHtml(post.selftext.trim())}
      </div>
    `;
    return;
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

