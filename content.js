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

function init() {
  if (isOldReddit) {
    const savedSkin = localStorage.getItem('rj_active_skin');
    if (savedSkin && SkinRegistry[savedSkin]) {
      State.activeSkin = savedSkin;
    }

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
