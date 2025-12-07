
(()=>{
  const el=document.querySelector('#today-date'); if(!el) return;
  const w=['日','月','火','水','木','金','土']; const d=new Date();
  const pad=n=>String(n).padStart(2,'0');
  el.textContent=`${d.getFullYear()}.${pad(d.getMonth()+1)}.${pad(d.getDate())} ${w[d.getDay()]}`;
})();
