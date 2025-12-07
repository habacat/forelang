
(()=>{
  const input=document.querySelector('#search-input');
  const panel=document.querySelector('#search-panel');
  if(!input||!panel) return;
  let idx=null, docs=[];
  const render=items=>{panel.innerHTML=items.map(i=>`<li><a href="${i.url}">${i.title}</a><span class="muted"> · ${i.date}</span></li>`).join('')};
  input.addEventListener('focus', async ()=>{
    if(idx) return;
    const res = await fetch(`${document.documentElement.dataset.base}search-index.json`);
    const data = await res.json(); docs = data;
    idx = elasticlunr(function(){ this.setRef('id'); this.addField('title'); this.addField('summary'); this.addField('content'); data.forEach((d,i)=>this.add({...d,id:i})) });
  });
  input.addEventListener('input', e=>{
    if(!idx) return; const q=e.target.value.trim(); if(!q){panel.innerHTML=''; return;}
    const result=idx.search(q,{bool:'OR',expand:true}).slice(0,8).map(r=>docs[r.ref]); render(result);
  });
  document.addEventListener('click',e=>{ if(!panel.contains(e.target) && e.target!==input){ panel.innerHTML=''; } });
})();
