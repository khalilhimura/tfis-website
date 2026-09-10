export function searchSections(sections, query) {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  return sections.map(s => {
    const title=s.title.toLowerCase(), text=s.text.toLowerCase();
    const score=terms.every(t => title.includes(t)||text.includes(t)) ? terms.reduce((n,t)=>n+(title.includes(t)?10:0)+(text.includes(t)?1:0),0) : 0;
    return {...s,score};
  }).filter(s=>s.score).sort((a,b)=>b.score-a.score).slice(0,30);
}