// ===== REDDIT JUPY - core/api.js =====

const isOldReddit = location.hostname === 'old.reddit.com';

// ─── EXTRACT SUBREDDIT FROM CURRENT URL ───────────────────
function extractSubredditFromUrl() {
  const path = location.pathname;
  const match = path.match(/^\/r\/([^\/\?\#]+)/i);
  if (match && match[1]) {
    return match[1];
  }
  return 'all';
}

// ─── FETCH SUBREDDIT POSTS ───────────────────────────────
async function fetchSubredditPosts(subreddit, afterToken = null, limit = 25) {
  try {
    const sub = subreddit || 'all';
    const endpoint = `/r/${encodeURIComponent(sub)}.json`;
    const url = `${endpoint}?limit=${limit}${afterToken ? `&after=${afterToken}` : ''}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    State.afterToken = data.data?.after || null;

    const posts = (data.data?.children || []).map(post => {
      const p = post.data;
      return {
        postId:                p.id,
        title:                 p.title,
        author:                p.author,
        score:                 p.score,
        url:                   p.url,
        permalink:             p.permalink,
        domain:                p.domain,
        subreddit:             p.subreddit,
        thumbnail:             p.thumbnail,
        num_comments:          p.num_comments,
        media:                 p.media,
        secure_media:          p.secure_media,
        preview:               p.preview,
        crosspost_parent_list: p.crosspost_parent_list,
        selftext:              p.selftext,
        isVideo:               p.is_video || false,
      };
    });

    return posts;
  } catch (err) {
    console.error('Failed to fetch posts:', err);
    return [];
  }
}

// ─── SEARCH SUBREDDITS ───────────────────────────────────
async function searchSubreddits(query) {
  try {
    const results = await fetch(`/subreddits/search.json?q=${encodeURIComponent(query)}&limit=10`);
    if (!results.ok) {
      throw new Error(`HTTP ${results.status}`);
    }
    const json = await results.json();

    return (json.data?.children || []).map(sub => ({
      name:        sub.data.display_name,
      title:       sub.data.title,
      subscribers: sub.data.subscribers,
      description: sub.data.public_description,
    }));
  } catch (err) {
    console.error('Search failed:', err);
    return [];
  }
}

// ─── FETCH THREAD COMMENTS ───────────────────────────────
async function fetchThreadComments(permalink, offset = 0, limit = 5) {
  try {
    const cleanPermalink = permalink.startsWith('http')
      ? new URL(permalink).pathname
      : (permalink.startsWith('/') ? permalink : `/${permalink}`);
    const url = `${cleanPermalink.replace(/\/+$/, '')}.json?limit=50`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP status code: ${res.status}`);
    }
    const json = await res.json();
    const commentTree = json[1]?.data?.children || [];
    const filteredComments = commentTree
      .filter(c => c.kind === 't1' && c.data?.body)
      .slice(offset, offset + limit)
      .map(c => ({
        author: c.data.author,
        body:   c.data.body,
        score:  c.data.score,
      }));

    return filteredComments;
  } catch (err) {
    console.error('Failed to fetch comments:', err);
    return [];
  }
}

// ─── READ INITIAL DOM POSTS (old.reddit.com) ─────────────
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
