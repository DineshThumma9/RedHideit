// ===== REDDIT JUPY - skins/base.js =====

class BaseSkin {
  constructor(name, state) {
    this.name = name;
    this.state = state;
    this.rootElement = null;
  }

  // Mount skin into the DOM
  mount() {
    throw new Error(`[${this.name}] mount() must be implemented.`);
  }

  // Render initial posts
  renderPosts(posts) {
    throw new Error(`[${this.name}] renderPosts() must be implemented.`);
  }

  // Append new paginated posts
  appendPosts(newPosts) {
    throw new Error(`[${this.name}] appendPosts() must be implemented.`);
  }

  // Update session / kernel status
  updateStatus(statusText, isActive = false) {
    throw new Error(`[${this.name}] updateStatus() must be implemented.`);
  }

  // Clean up when switching skin
  unmount() {
    if (this.rootElement) {
      this.rootElement.remove();
      this.rootElement = null;
    }
  }
}

// ─── FUTURE SKIN PLACEHOLDER (VS Code) ───────────────────
class VSCodeSkin extends BaseSkin {
  constructor(state) {
    super('vscode', state);
  }
  mount() {
    console.log('VS Code skin mounting... (Coming soon)');
  }
  renderPosts(posts) {}
  appendPosts(newPosts) {}
  updateStatus(statusText, isActive) {}
}
