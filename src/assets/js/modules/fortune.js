
(()=>{
  const btn=document.querySelector('#fortune-btn'); const out=document.querySelector('#fortune-out');
  if(!btn||!out) return;
  const f=[{t:'大吉',a:'宜：刷题、赶deadline、追番；忌：谈恋爱'},{t:'中吉',a:'宜：背单词、整理笔记；忌：熬夜'},{t:'小吉',a:'宜：多喝水、散步；忌：拖延'},{t:'凶',a:'宜：复盘；忌：冲动消费'},{t:'大凶',a:'宜：休息；忌：内耗'}];
  btn.addEventListener('click', ()=>{ const p=f[Math.floor(Math.random()*f.length)]; out.innerHTML=`今日运势：<b>${p.t}</b><br>${p.a}`; });
})();
