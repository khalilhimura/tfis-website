// Offsets use the article's textContent; wrapping marks never changes that text.
export function captureRange(article, range) {
  if (!range || range.collapsed || !article.contains(range.startContainer) || !article.contains(range.endContainer)) throw Error('Select a passage in the book first.');
  for (const node of article.querySelectorAll('button, .code-toolbar, script, style')) if (range.intersectsNode(node)) throw Error('Select the passage without its controls.');
  const before = range.cloneRange(); before.selectNodeContents(article); before.setEnd(range.startContainer,range.startOffset);
  let start = before.toString().length, quote = range.toString();
  start += quote.length - quote.trimStart().length; quote = quote.trim();
  if (!quote || quote.length > 12000) throw Error('Select a passage between 1 and 12,000 characters.');
  const end = start + quote.length, text = article.textContent;
  return {quote,start_offset:start,end_offset:end,prefix:text.slice(Math.max(0,start-48),start),suffix:text.slice(end,end+48)};
}
export function resolveAnchor(text, point) {
  const {quote,prefix='',suffix=''} = point;
  if (!quote) return null;
  const candidates=[];
  for(let start=text.indexOf(quote);start>=0;start=text.indexOf(quote,start+1)) {
    const end=start+quote.length;
    const score=Number(!!prefix && text.slice(Math.max(0,start-prefix.length),start)===prefix)+Number(!!suffix && text.slice(end,end+suffix.length)===suffix);
    candidates.push({start,end,score});
  }
  if (candidates.length===1) return {start:candidates[0].start,end:candidates[0].end};
  candidates.sort((a,b)=>b.score-a.score);
  if(candidates[0]?.score>0 && candidates[0].score>(candidates[1]?.score??-1)) return {start:candidates[0].start,end:candidates[0].end};
  return null;
}
export function paintHighlights(article, points) {
  for(const mark of article.querySelectorAll('mark[data-point-ids]')) mark.replaceWith(...mark.childNodes);
  article.normalize();
  const text=article.textContent, resolved=points.map(point=>({...resolveAnchor(text,point),id:point.id})).filter(p=>Number.isInteger(p.start));
  const walker=article.ownerDocument.createTreeWalker(article,4),nodes=[];
  let node,offset=0;
  while((node=walker.nextNode())) {nodes.push({node,start:offset,end:offset+node.length});offset+=node.length;}
  for(const {node,start,end} of nodes) {
    if(node.parentElement.closest('button,.code-toolbar,script,style')) continue;
    const hits=resolved.filter(p=>p.start<end && p.end>start); if(!hits.length) continue;
    const cuts=[...new Set([start,end,...hits.flatMap(p=>[Math.max(start,p.start),Math.min(end,p.end)])])].sort((a,b)=>a-b);
    const fragment=article.ownerDocument.createDocumentFragment();
    for(let i=0;i<cuts.length-1;i++) {
      const a=cuts[i],b=cuts[i+1],ids=hits.filter(p=>p.start<b&&p.end>a).map(p=>p.id).sort();
      const part=article.ownerDocument.createTextNode(node.data.slice(a-start,b-start));
      if(ids.length){const mark=article.ownerDocument.createElement('mark');mark.dataset.pointIds=ids.join(' ');mark.append(part);fragment.append(mark);}else fragment.append(part);
    }
    node.replaceWith(fragment);
  }
  return new Set(resolved.map(p=>p.id));
}
