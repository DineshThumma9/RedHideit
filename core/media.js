// ===== REDDIT JUPY - core/media.js =====

// ─── RENDER MEDIA (Reddit Video, YouTube, Streamable, Gifs, Images, Selftext) ───
async function renderMedia(post, el) {
  if (!el) return;
  el.textContent = ''; // Safely clear container
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
        const cleanPermalink = post.permalink.startsWith('http')
          ? new URL(post.permalink).pathname
          : (post.permalink.startsWith('/') ? post.permalink : `/${post.permalink}`);
        const res = await fetch(`${cleanPermalink.replace(/\/+$/, '')}.json?limit=1`);
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
    const video = document.createElement('video');
    video.controls = true;
    video.playsInline = true;
    video.preload = 'metadata';
    video.style.width = '100%';
    video.style.maxHeight = '450px';
    video.style.background = '#000';

    const source = document.createElement('source');
    source.src = redditVideoUrl;
    source.type = 'video/mp4';
    video.appendChild(source);

    el.appendChild(video);
    return;
  }

  // 2. YouTube Embeds
  const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (ytMatch && ytMatch[1]) {
    const iframe = document.createElement('iframe');
    iframe.width = '100%';
    iframe.height = '360';
    iframe.src = `https://www.youtube.com/embed/${encodeURIComponent(ytMatch[1])}`;
    iframe.frameBorder = '0';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    iframe.style.borderRadius = '6px';
    el.appendChild(iframe);
    return;
  }

  // 3. Streamable Embeds
  const streamableMatch = url.match(/streamable\.com\/([a-zA-Z0-9]+)/i);
  if (streamableMatch && streamableMatch[1]) {
    const iframe = document.createElement('iframe');
    iframe.width = '100%';
    iframe.height = '360';
    iframe.src = `https://streamable.com/e/${encodeURIComponent(streamableMatch[1])}`;
    iframe.frameBorder = '0';
    iframe.allowFullscreen = true;
    iframe.style.borderRadius = '6px';
    el.appendChild(iframe);
    return;
  }

  // 4. Imgur / RedGifs / Gfycat / Direct Video Files (.mp4, .webm, .gifv)
  if (/\.(mp4|webm)(\?.*)?$/i.test(url)) {
    const video = document.createElement('video');
    video.controls = true;
    video.playsInline = true;
    video.preload = 'metadata';
    video.style.width = '100%';
    video.style.maxHeight = '450px';
    const source = document.createElement('source');
    source.src = url;
    source.type = 'video/mp4';
    video.appendChild(source);
    el.appendChild(video);
    return;
  }

  if (/\.gifv?$/i.test(url)) {
    const video = document.createElement('video');
    video.controls = true;
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.style.width = '100%';
    video.style.maxHeight = '450px';
    const source = document.createElement('source');
    source.src = url.replace(/\.gifv?$/i, '.mp4');
    source.type = 'video/mp4';
    video.appendChild(source);
    el.appendChild(video);
    return;
  }

  // 5. Images (i.redd.it, imgur, png, jpg, gif, webp)
  if (/\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(url) || url.includes('i.redd.it') || (url.includes('imgur.com') && !url.includes('/a/'))) {
    const img = document.createElement('img');
    img.src = url;
    img.loading = 'lazy';
    img.alt = 'Reddit media';
    el.appendChild(img);
    return;
  }

  // 6. Text Post Selftext preview if available
  if (post.selftext && post.selftext.trim()) {
    const box = document.createElement('div');
    box.style.background = 'var(--page-bg)';
    box.style.border = '1px solid var(--border)';
    box.style.borderRadius = '6px';
    box.style.padding = '12px 14px';
    box.style.fontSize = '13px';
    box.style.color = 'var(--text-primary)';
    box.style.maxHeight = '300px';
    box.style.overflowY = 'auto';
    box.style.whiteSpace = 'pre-wrap';
    box.textContent = post.selftext.trim();
    el.appendChild(box);
    return;
  }
}
