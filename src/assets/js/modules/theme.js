
(()=>{
  const t=document.querySelector('#theme-toggle');
  const r=document.documentElement;
  const s=localStorage.getItem('theme'); if(s) r.setAttribute('data-theme', s);
  t?.addEventListener('click', ()=>{
    const next = r.getAttribute('data-theme')==='dark'?'light':'dark';
    r.setAttribute('data-theme', next); localStorage.setItem('theme', next);
  });
})();
