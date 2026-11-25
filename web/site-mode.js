/* BitBeam Site · Live-only page (see site-mode.css). Keeps Live on screen, bank 1 only,
   trims the visualizer toolbar to camera controls. Works only through the existing UI —
   no app logic is changed. */
(()=>{
 document.body.classList.add('bb-site');
 document.title='BitBeam · Live';
 const KEEP_TOOLS=new Set(['☀','eco','center','−','-','+','⛶']);
 function trimToolbar(){
  for(const b of document.querySelectorAll('.viz-toolbar > button')){
   const t=(b.textContent||'').trim().toLowerCase();
   b.style.display=KEEP_TOOLS.has(t)?'':'none';
  }
 }
 function keepLive(){
  const live=document.querySelector('button.nav[data-view="visualizer"]');
  const cur=document.querySelector('main .view:not(.hidden)');
  if(live&&cur&&cur.id!=='view-visualizer')live.click();
 }
 function bankOne(){
  const first=document.querySelector('.bank-tabs button');
  if(first&&!first.classList.contains('active'))first.click();
 }
 const HIDE=['#bb-voice','#bb-link','#bb-link-downbeat','header.topbar nav','header.topbar .top-actions','#midi-open73',
  '.preview-row80','.look-search-row','.bank-tabs','#save-look',
  '#calibration-targets69','#viz-spectrogram',
  '.live-vz-main28 > :not(.viz-main):not(.wheels-row)','.viz-sidebar > :not(#viz-group-picker)',
  '#viz-group-picker > :not(h3):not(.group-picker-list)','.bb-menu details','#positions35'];
 function hide(){for(const sel of HIDE)for(const el of document.querySelectorAll(sel))if(el.style.getPropertyValue('display')!=='none')el.style.setProperty('display','none','important');
  for(const [i,el] of [...document.querySelectorAll('#look-grid .look')].entries()){const want=i<6?'':'none';if(el.style.getPropertyValue('display')!==want){if(want)el.style.setProperty('display','none','important');else el.style.removeProperty('display');}}}
 function size(){const v=document.getElementById('stage-viewport');if(!v)return;const top=v.getBoundingClientRect().top;const h=Math.max(420,window.innerHeight-top-120)+'px';if(v.style.getPropertyValue('height')!==h){v.style.setProperty('height',h,'important');v.style.setProperty('max-height','none','important');v.style.setProperty('aspect-ratio','auto','important');}}
 window.addEventListener('resize',size);
 function tick(){hide();size();trimToolbar();keepLive();bankOne();}
 /* ---- site tabs: MAIN (the Live page) · ABOUT · DOWNLOAD ---- */
 const TABS=[['main','MAIN'],['about','ABOUT'],['download','DOWNLOAD']];
 function buildTabs(){
  const top=document.querySelector('header.topbar');if(!top||document.getElementById('site-tabs'))return;
  const bar=document.createElement('div');bar.id='site-tabs';bar.className='site-tabs';
  for(const [id,label] of TABS){const b=document.createElement('button');b.type='button';b.className='nav site-tab';b.dataset.siteTab=id;b.textContent=label;b.onclick=()=>{location.hash=id==='main'?'':id;showTab(id);};bar.append(b);}
  top.prepend(bar);
  for(const [id,label] of TABS.slice(1)){const page=document.createElement('section');page.id='site-page-'+id;page.className='site-page';
   page.innerHTML='<div class="site-page-inner"><h1>'+label.charAt(0)+label.slice(1).toLowerCase()+'</h1><p class="site-page-soon">Coming soon.</p></div>';document.getElementById('app')?.append(page);}
 }
 function syncTabs(){const id=document.body.dataset.siteTab||'main';for(const b of document.querySelectorAll('.site-tab')){const on=b.dataset.siteTab===id;if(b.classList.contains('active')!==on)b.classList.toggle('active',on);}}
 function showTab(id){
  if(!TABS.some(t=>t[0]===id))id='main';
  document.body.dataset.siteTab=id;
  syncTabs();
  for(const pg of document.querySelectorAll('.site-page'))pg.hidden=pg.id!=='site-page-'+id;
  if(id==='main')setTimeout(()=>{size();window.dispatchEvent(new Event('resize'));},50);
 }
 buildTabs();showTab((location.hash||'').slice(1)||'main');
 window.addEventListener('hashchange',()=>showTab((location.hash||'').slice(1)||'main'));
 tick();
 [300,1000,2500].forEach(ms=>setTimeout(tick,ms));
 let q=0;new MutationObserver(()=>{if(q)return;q=requestAnimationFrame(()=>{q=0;hide();syncTabs();trimToolbar();bankOne();});}).observe(document.body,{childList:true,subtree:true});
})();
