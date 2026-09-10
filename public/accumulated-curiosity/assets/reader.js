import {searchSections} from './search.mjs';
const announce=text=>{document.querySelector('#reader-status').textContent=text;};
document.querySelector('#theme-toggle')?.addEventListener('click',()=>{
  const isDark=document.documentElement.dataset.theme==='dark'||(!document.documentElement.dataset.theme&&matchMedia('(prefers-color-scheme: dark)').matches);
  const theme=isDark?'light':'dark';document.documentElement.dataset.theme=theme;
  try{localStorage.setItem('ac-theme',theme);}catch{}
  announce(`${theme} theme selected`);
});
document.querySelectorAll('.copy-code').forEach(button=>button.addEventListener('click',async()=>{
  const code=button.closest('.code-block').querySelector('code').textContent;
  try {await navigator.clipboard.writeText(code);button.textContent='Copied';announce('Code copied');setTimeout(()=>button.textContent='Copy',1800);}
  catch {button.textContent='Select code';announce('Copy is unavailable. Select the code and copy it manually.');}
}));
const form=document.querySelector('#book-search');
if(form){
  const input=document.querySelector('#search-query'),summary=document.querySelector('#search-summary'),list=document.querySelector('#search-results');
  let index;
  const perform=async()=>{
    list.replaceChildren();
    try{
      if(!index){const response=await fetch(new URL('./search-index.json',import.meta.url));if(!response.ok)throw Error('Search unavailable');index=await response.json();}
      const query=input.value.trim();const results=searchSections(index,query);
      summary.textContent=!query?'Enter a word or phrase.':`${results.length}${results.length===30?'+':''} matching sections`;
      for(const result of results){const item=document.createElement('li'),a=document.createElement('a'),p=document.createElement('p'),label=document.createElement('span');a.href=result.url;a.textContent=result.title;label.textContent=result.chapter||'Before you begin';p.textContent=result.text.slice(0,220)+'…';item.append(label,a,p);list.append(item);}
      history.replaceState(null,'',location.pathname+(query?'?q='+encodeURIComponent(query):''));
    }catch{summary.textContent='Search could not load. You can still use the chapter contents.';}
  };
  form.addEventListener('submit',e=>{e.preventDefault();perform();});
  input.value=new URLSearchParams(location.search).get('q')||'';if(input.value)perform();
}
