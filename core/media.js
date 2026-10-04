// ===== REDDIT JUPY - core/media.js =====

// ─── RENDER MEDIA (Reddit Video, YouTube, Streamable, Gifs, Images, Selftext) ───
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
