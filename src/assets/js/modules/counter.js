
(()=>{
  const runEl=document.querySelector('#site-run-days');
  const totalEl=document.querySelector('#site-total');
  const todayEl=document.querySelector('#site-today');
  const keyBase='kotokowa-forelang'; const api='https://api.countapi.xyz';
  const launch=new Date('2025-12-05T00:00:00+08:00');
  if(runEl){ const diff=Math.floor((Date.now()-launch.getTime())/86400000)+1; runEl.textContent=`本站已运行${diff}天`; }
  function fmt(v){ return v<=0?null:`${v}人`; }
  async function todayKey(){ const d=new Date(); const p=n=>String(n).padStart(2,'0'); return `${keyBase}-${d.getFullYear()}${p(d.getMonth()+1)}${p(d.getDate())}`; }
  async function getCount(k){ try{ const r=await fetch(`${api}/get/kotokowa/${k}`); const j=await r.json(); return j.value||0; }catch(e){return 0;} }
  async function show(){ const total=await getCount(`${keyBase}-total`); const tk=await todayKey(); const today=await getCount(tk);
    totalEl && (total? totalEl.textContent=`历史总访客：${fmt(total)}` : totalEl.textContent='您是发现这个网站的第一人！');
    todayEl && (today? todayEl.textContent=`今日访客：${fmt(today)}` : todayEl.textContent='今天还没有访客呢喵'); }
  show();
  async function inc(){ try{ await fetch(`${api}/hit/kotokowa/${keyBase}-total`); const tk=await todayKey(); await fetch(`${api}/hit/kotokowa/${tk}`);}catch(e){} }
  window.addEventListener('pagehide', inc, {once:true});
})();
