export function safeReturn(value, base) {
  const fallback = `${base}/library/`;
  try {
    if (!value?.startsWith(`${base}/`) || /[\\\x00-\x20]/.test(value)) return fallback;
    const decoded = decodeURIComponent(value);
    if (decoded.includes('..') || decoded.includes('//') || decoded.includes('\\')) return fallback;
    const url = new URL(value, 'https://reader.invalid');
    if (url.origin !== 'https://reader.invalid' || !url.pathname.startsWith(`${base}/`) || url.pathname === `${base}/login/`) return fallback;
    return url.pathname + url.search + url.hash;
  } catch { return fallback; }
}
export function validateMetadata({comments = '', thoughts = '', links = []}) {
  comments = comments.trim(); thoughts = thoughts.trim();
  if (comments.length > 10000 || thoughts.length > 10000) throw Error('Keep each note under 10,000 characters.');
  if (typeof links === 'string') links = links.split('\n').map(s=>s.trim()).filter(Boolean);
  if (links.length > 20) throw Error('Add up to 20 links.');
  links = links.map(link=>{
    let url; try { url = new URL(link); } catch { throw Error('Each link needs a full http:// or https:// address.'); }
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password || link.length > 2000) throw Error('Use HTTP or HTTPS links without embedded passwords, under 2,000 characters.');
    return url.href;
  });
  return {comments, thoughts, links};
}
export function groupPoints(points, {query = '', chapter = '', sort = 'newest'} = {}) {
  const needle = query.trim().toLocaleLowerCase();
  const filtered = points.filter(p=>(!chapter || p.page_path === chapter) && (!needle || [p.quote,p.page_title,p.section_title,p.comments,p.thoughts,...(p.links||[])].join(' ').toLocaleLowerCase().includes(needle)));
  filtered.sort((a,b)=>(sort === 'oldest' ? 1 : -1) * a.created_at.localeCompare(b.created_at) || a.id.localeCompare(b.id));
  const groups = new Map();
  for (const point of filtered) {
    if (!groups.has(point.page_path)) groups.set(point.page_path,{path:point.page_path,title:point.page_title,points:[]});
    groups.get(point.page_path).points.push(point);
  }
  return [...groups.values()];
}
export function readingPosition(rect, viewportHeight, headerBottom) {
  const obstruction = Math.max(0,headerBottom);
  return Math.max(0,Math.min(1,(obstruction-rect.top)/Math.max(1,rect.height-(viewportHeight-obstruction))));
}
