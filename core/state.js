// ===== REDDIT JUPY - core/state.js =====

const State = {
  currentSubreddit: 'all',
  afterToken: null,
  posts: [],
  isLoading: false,
  activeSkin: 'kaggle', // 'kaggle' | 'jupyter' | 'vscode'
  theme: 'dark',        // 'dark' | 'kaggle' | 'light'
};

const commentOffsets = {};
let executionCounter = 1;
