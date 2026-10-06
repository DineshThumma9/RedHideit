// ===== REDDIT JUPY - content.js (Main Entry & Skin Router) =====

const SkinRegistry = {
  kaggle: KaggleSkin,
  jupyter: JupyterSkin,
  vscode: VSCodeSkin,
};

let activeSkinInstance = null;

window.switchSkin = function(skinName) {
  if (!SkinRegistry[skinName]) return;
  State.activeSkin = skinName;
  localStorage.setItem('rj_active_skin', skinName);

  if (activeSkinInstance) {
    activeSkinInstance.unmount();
  }

  const SkinClass = SkinRegistry[skinName] || KaggleSkin;
  activeSkinInstance = new SkinClass(State);
  activeSkinInstance.mount();
};

async function init() {
  // Prevent duplicate mounts
  if (document.getElementById('rj-notebook') || document.getElementById('rj-jupyter-root')) {
    return;
  }

  const savedSkin = localStorage.getItem('rj_active_skin');
  if (savedSkin && SkinRegistry[savedSkin]) {
    State.activeSkin = savedSkin;
  }

  const sub = extractSubredditFromUrl();
  State.currentSubreddit = sub;

  // 1. Try reading old.reddit server-rendered DOM posts
  let posts = readOldRedditPosts();

  const SkinClass = SkinRegistry[State.activeSkin] || KaggleSkin;
  activeSkinInstance = new SkinClass(State);

  if (posts && posts.length > 0) {
    State.currentSubreddit = posts[0]?.subreddit || sub;
    State.posts = posts;
    activeSkinInstance.mount();
  } else {
    // 2. On www.reddit.com or direct API loads: Mount skin shell immediately, then fetch posts
    activeSkinInstance.mount();
    posts = await fetchSubredditPosts(sub);
    State.posts = posts;
    if (activeSkinInstance && typeof activeSkinInstance.renderPosts === 'function') {
      activeSkinInstance.renderPosts(posts);
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
