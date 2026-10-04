// ===== REDDIT JUPY - content.js (Main Entry & Skin Router) =====

const SkinRegistry = {
  kaggle: KaggleSkin,
  jupyter: JupyterSkin,
  vscode: VSCodeSkin,
};

let activeSkinInstance = null;

function init() {
  if (isOldReddit) {
    const posts = readOldRedditPosts();
    if (!posts.length) return;
    State.currentSubreddit = posts[0]?.subreddit || 'all';
    State.posts = posts;

    // Instantiate and mount the active skin
    const SkinClass = SkinRegistry[State.activeSkin] || KaggleSkin;
    activeSkinInstance = new SkinClass(State);
    activeSkinInstance.mount();
  }
}

if (document.readyState === 'complete') {
  init();
} else {
  window.addEventListener('load', init);
}
