window.addEventListener('load',()=>{
  const root=document.querySelector('#music');
  if(!root)return;
  const storageKey='music_autoplay';
  let autoplay=localStorage.getItem(storageKey)!=='off';

  const controls=document.createElement('div');
  controls.className='music-controls';

  const btn=document.createElement('button');
  btn.className='music-toggle';
  const syncLabel=()=>{
    btn.innerHTML = autoplay
      ? '<i class="fa-solid fa-volume-high" aria-hidden="true"></i>'
      : '<i class="fa-solid fa-volume-xmark" aria-hidden="true"></i>';
    btn.title = autoplay ? '关闭自动播放' : '开启自动播放';
    btn.setAttribute('aria-label', btn.title);
  };
  syncLabel();

  const renderPlayer=()=>{
    const old=root.querySelector('meting-js');
    if(old) old.remove();
    const player=document.createElement('meting-js');
    player.setAttribute('server','netease');
    player.setAttribute('type','playlist');
    player.setAttribute('id','7452421335');
    player.setAttribute('fixed','true');
    player.setAttribute('autoplay',autoplay?'true':'false');
    player.className='music-player';
    root.appendChild(player);
  };

  btn.addEventListener('click',()=>{
    autoplay=!autoplay;
    localStorage.setItem(storageKey, autoplay ? 'on' : 'off');
    syncLabel();
    renderPlayer();
  });

  controls.appendChild(btn);
  root.innerHTML='';
  root.appendChild(controls);
  renderPlayer();
});
