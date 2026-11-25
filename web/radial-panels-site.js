/* Approved Color Chase / Movement design, 0.16.34.
   SVG is interface artwork, never a screenshot overlay. Existing engine actions are retained. */
(function(){
 'use strict';
 const labels={static:'Solid',pulse:'Pulse',chase:'Chase',rainbow:'Rainbow',breathe:'Breathe',alternate:'Alternate',sparkle:'Sparkle',gradient:'Gradient',hold:'Hold',sweep:'Sweep',circle:'Circle',fan:'Fan',figure8:'Figure 8',bounce:'Bounce',zigzag:'Zigzag',cross:'Cross'};
 const icons={
  static:'<circle cx="32" cy="32" r="12" fill="#c9e1ff" stroke="none"/><path d="M32 5v7m0 40v7M5 32h7m40 0h7M13 13l5 5m28 28 5 5M13 51l5-5m28-28 5-5" stroke="#c9e1ff"/>',
  pulse:'<path d="M3 34h10l6-17 9 34 10-42 8 31 6-13h9" stroke="#ff7aab"/>',
  chase:'<path d="m7 17 13 15L7 47h10l13-15-13-15zm20 0 13 15-13 15h10l13-15-13-15zm20 0 13 15-13 15h10l13-15-13-15z" fill="#13ceff" stroke="none" transform="translate(-5 0)"/>',
  rainbow:'<path d="M4 46a28 28 0 0 1 56 0" stroke="#ff647b"/><path d="M10 46a22 22 0 0 1 44 0" stroke="#ffa42f"/><path d="M16 46a16 16 0 0 1 32 0" stroke="#ffe577"/><path d="M22 46a10 10 0 0 1 20 0" stroke="#46d6b5"/><path d="M28 46a4 4 0 0 1 8 0" stroke="#66a2ff"/>',
  breathe:'<path d="M2 33C13 8 23 56 34 32S52 13 62 32" stroke="url(#RG-breathe)"/>',
  alternate:'<circle cx="23" cy="32" r="19" fill="#008cff" stroke="none"/><circle cx="42" cy="32" r="19" fill="#e52cda" opacity=".85" stroke="none"/>',
  sparkle:'<path d="M34 4q0 21 20 23-20 1-20 22-1-21-21-22Q33 25 34 4" fill="#ffdb54" stroke="none"/><path d="M12 35q0 10 10 11-10 1-10 12-1-11-11-12 10-1 11-11M54 34q0 8 8 9-8 1-8 9-1-8-9-9 8-1 9-9" fill="#ed90f4" stroke="none"/>',
  gradient:'<path d="M10 48V30m9 18V22m9 26V13m9 35V8m9 40V17m9 31V26" stroke="url(#RG-breathe)" stroke-width="5"/>',
  hold:'<circle cx="32" cy="32" r="21" stroke="#cbdfff"/><circle cx="32" cy="32" r="13" fill="#cbdfff" stroke="none"/>',
  sweep:'<path d="M6 42C6 5 53 5 56 36"/><path d="m46 32 10 12 7-15" fill="#50d4fa" stroke="none"/>',
  circle:'<path d="M19 12A23 23 0 0 0 12 48m33 4a23 23 0 0 0 7-36"/><path d="m7 40 5 15 14-8M42 18l10-14 7 16" fill="#50d4fa" stroke="none"/>',
  fan:'<path d="M3 25q29-30 58 0M12 34q20-21 40 0M21 43q11-12 22 0"/><circle cx="32" cy="52" r="4" fill="#50d4fa" stroke="none"/>',
  figure8:'<path d="M32 32C5-3-8 64 25 41L39 23C72 0 60 68 32 32Z"/>',
  bounce:'<path d="M3 45Q17 2 32 39T61 40" stroke-dasharray="1 9" stroke-width="6"/>',
  zigzag:'<path d="m3 45 16-23 5 19 16-25 5 20 16-25"/><path d="m50 10 14-4-3 15" fill="#50d4fa" stroke="none"/>',
  cross:'<path d="M32 8v48M8 32h48"/><path d="m32 1-8 12h16zM32 63l-8-12h16zM1 32l12-8v16zM63 32l-12-8v16z" fill="#50d4fa" stroke="none"/>'
 };
 const point=(r,deg)=>{const a=deg*Math.PI/180;return [300+Math.cos(a)*r,300+Math.sin(a)*r];};
 const xy=p=>p.map(n=>n.toFixed(3)).join(' ');
 // Offset each radial divider by a fixed perpendicular distance. Adjacent
 // edges are parallel, so the gap stays 10 units at BOTH radii.
 function sector(a,b){const inset=r=>Math.asin(5/r)*180/Math.PI,outer=inset(285),inner=inset(164),large=b-a-2*outer>180?1:0,innerLarge=b-a-2*inner>180?1:0;return `M${xy(point(285,a+outer))}A285 285 0 ${large} 1 ${xy(point(285,b-outer))}L${xy(point(164,b-inner))}A164 164 0 ${innerLarge} 0 ${xy(point(164,a+inner))}Z`;}
 function keyActivate(node,fn){node.onclick=fn;node.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();fn();}};}
 /* 0.16.76: Random chase selector on the inner ring, between the Stop / Freeze button and the ticks: an arc window with
    the chase number and arc buttons for the previous / next chase at its ends. CHASE_ARC76 picks the sketch variant. */
 const CHASE_ARC76=(typeof window==='object'&&window.CHASE_ARC76)||'half';
 function ring76(r1,r2,a,b){const p=(r,t)=>xy(point(r,t)),large=b-a>180?1:0;return `M${p(r2,a)}A${r2} ${r2} 0 ${large} 1 ${p(r2,b)}L${p(r1,b)}A${r1} ${r1} 0 ${large} 0 ${p(r1,a)}Z`;}
 function chaseArc76(){const half=CHASE_ARC76==='half',r1=95,r2=131,rm=(r1+r2)/2,win=half?[-158,-22]:[-118,-62],left=half?[-196,-164]:[-150,-122],right=half?[-16,16]:[-58,-30];
  const chevron=(range,dir)=>{const a=(range[0]+range[1])/2,[x,y]=point(rm,a);return `<path d="M${dir*5} -10L${-dir*5} 0L${dir*5} 10" transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"/>`;};
  const [nx,ny]=point(rm,-90);
  return `<g class="radial-chase76 ${half?'half76':'top76'}" display="none"><path class="radial-chase-window76" d="${ring76(r1,r2,win[0],win[1])}"/><text class="radial-chase-number76" x="${nx.toFixed(1)}" y="${(ny+11).toFixed(1)}" text-anchor="middle"></text>`+
   `<g class="radial-chase-arrow76" data-step="-1" role="button" tabindex="0" aria-label="Previous chase"><path class="radial-chase-key76" d="${ring76(r1,r2,left[0],left[1])}"/>${chevron(left,1)}</g>`+
   `<g class="radial-chase-arrow76" data-step="1" role="button" tabindex="0" aria-label="Next chase"><path class="radial-chase-key76" d="${ring76(r1,r2,right[0],right[1])}"/>${chevron(right,-1)}</g></g>`;}
 function drawWheel(root,o){
  const signature=o.type+o.choices.join(',');
  if(root.dataset.radialSignature!==signature){
   root.dataset.radialSignature=signature;root.classList.add('radial-wheel34');
   const id='radial-'+o.type;
   let ticks='';for(let i=0;i<48;i++){const a=i*7.5;ticks+=`<path d="M${xy(point(i%4?143:137,a))}L${xy(point(151,a))}"/>`;}
   const segments=o.choices.map((effect,i)=>{const angle=-90+i*360/o.choices.length,p=point(224,angle),body=(icons[effect]||icons.hold).replaceAll('RG-',id+'-');return `<g class="radial-segment" data-effect="${effect}" role="button" tabindex="0" aria-label="${labels[effect]||effect}"><path class="radial-sector" d="${sector(angle-180/o.choices.length,angle+180/o.choices.length)}"/><g class="radial-icon" transform="translate(${p[0]-30} ${p[1]-45}) scale(.94)" fill="none" stroke="#50d4fa" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round">${body}</g><text class="radial-label" x="${p[0]}" y="${p[1]+32}" text-anchor="middle">${labels[effect]||effect}</text></g>`;}).join('');
   root.innerHTML=`<svg class="radial-svg" viewBox="0 0 600 600" aria-label="${o.type==='color'?'Color Chase':'Movement'} effects"><defs><linearGradient id="${id}-surface" x2=".35" y2="1"><stop stop-color="#2a3a4e"/><stop offset="1" stop-color="#111e2d"/></linearGradient><linearGradient id="${id}-active" x2=".6" y2="1"><stop stop-color="#123b54"/><stop offset="1" stop-color="#022537"/></linearGradient><radialGradient id="${id}-center" cx=".4" cy=".2"><stop stop-color="#2b4159"/><stop offset="1" stop-color="#091a2d"/></radialGradient><linearGradient id="${id}-breathe"><stop stop-color="#23d5ff"/><stop offset="1" stop-color="#ed85f5"/></linearGradient><filter id="${id}-glow" x="-.4" y="-.4" width="1.8" height="1.8"><feGaussianBlur stdDeviation="5"/></filter></defs><circle class="radial-rim" cx="300" cy="300" r="290"/><g class="radial-ticks">${ticks}</g><g class="radial-orbit" aria-hidden="true"><path d="M300 300C168 152 158 419 283 321L317 279C440 181 430 448 300 300"/></g>${segments}<g class="radial-center" role="button" tabindex="0"><circle class="radial-center-glow" cx="300" cy="300" r="88"/><circle class="radial-center-surface" cx="300" cy="300" r="83"/><g class="radial-center-icon"></g><text class="radial-center-title" x="300" y="321" text-anchor="middle"></text><text class="radial-center-subtitle" x="300" y="346" text-anchor="middle"></text></g>${chaseArc76()}${o.type==='move'?`<g class="radial-loop84" role="button" tabindex="0" aria-label="Loop the selected chase" aria-pressed="false"><rect x="254" y="396" width="92" height="32" rx="16"/><path class="radial-loop-icon84" d="M272 412a7 7 0 0 1 7-7h6m0 0-3-3m3 3-3 3m10 7a7 7 0 0 1-7 7h-6m0 0 3 3m-3-3 3-3" transform="translate(-2 -1)"/><text x="315" y="417" text-anchor="middle">Loop</text></g>`:''}</svg>`;
   root.style.setProperty('--radial-surface',`url(#${id}-surface)`);root.style.setProperty('--radial-active',`url(#${id}-active)`);root.style.setProperty('--radial-center',`url(#${id}-center)`);
  }
  for(const n of root.querySelectorAll('[data-effect]')){const active=n.dataset.effect===o.selected;n.classList.toggle('active',active);n.setAttribute('aria-pressed',String(active));keyActivate(n,()=>o.onSelect(n.dataset.effect));}
  root.classList.toggle('radial-color34',o.type==='color');root.classList.toggle('radial-frozen34',!!o.frozen);
  const center=root.querySelector('.radial-center'),disabled=!!o.centerDisabled;
  center.setAttribute('aria-disabled',String(disabled));center.setAttribute('aria-label',o.type==='color'?'Add Color':o.frozen?'Resume all movement':'Stop / Freeze All');center.setAttribute('aria-pressed',String(!!o.frozen));
  keyActivate(center,()=>{if(!disabled)o.onCenter();});
  root.classList.toggle('radial-loop-on84',!!o.loop);const lb=root.querySelector('.radial-loop84');if(lb){lb.setAttribute('aria-pressed',String(!!o.loop));keyActivate(lb,()=>o.onLoop&&o.onLoop());}
  root.querySelector('.radial-center-icon').innerHTML=o.type==='color'?'<path d="M300 263v34m-17-17h34"/>':o.frozen?'<path d="m290 262 24 15-24 15z" fill="currentColor" stroke="none"/>':'<path d="M291 263v27m18-27v27"/>';
  root.querySelector('.radial-center-title').textContent=o.type==='color'?'Add Color':o.frozen?'Resume':'Stop / Freeze';root.querySelector('.radial-center-subtitle').textContent=o.type==='color'?'':'All';
 }
 if(typeof module!=='undefined'&&module.exports){module.exports={drawWheel};return;}
 const $=id=>document.getElementById(id),make=(tag,cls,text)=>{const n=document.createElement(tag);n.className=cls||'';if(text)n.textContent=text;return n;};
 function wheel(id,choices,selected,callback){
  const type=id==='color-wheel'?'color':'move',select=$(type+'-pattern');
  if(select){if(select.options.length!==choices.length)select.replaceChildren(...choices.map(fx=>new Option(labels[fx]||fx,fx)));select.value=selected;}
  drawWheel($(id),{type,choices,selected,frozen:show.motionFrozen,chase:window.RandomParts76?RandomParts76.label(RandomParts76.info(show,typeof lastState==='undefined'?null:lastState,window.Visualizer?.selectionIds?.()||[],type)):'',loop:loopOn84(),onLoop:toggleLoop84,centerDisabled:type==='color'&&$('palette-add').disabled,onSelect:callback,onCenter:()=>{if(type==='color')$('palette-add').click();else{if(show.motionFrozen)revertChase76();show.motionFrozen=!show.motionFrozen;save(true);renderLive();}}});
 }
 const panels=[];
 for(const type of ['color','move']){
  const card=document.querySelector(type==='color'?'.color-card':'.move-card');card.classList.add('radial-panel34');card.dataset.engineType=type;
  card.querySelector('.card-head span').textContent=type==='color'?'Color Chase':'Movement';
  const body=card.querySelector('.reference-engine'),knobs=card.querySelector('.knob-column'),options=card.querySelector('.engine-options');
  body.classList.add('radial-body34');body.append($(type==='color'?'color-wheel':'move-wheel'));if(type==='color'){const edit=make('button','chase-edit82','Edit');edit.type='button';edit.id='color-edit82';edit.title='Show the Color editing buttons';edit.onclick=()=>setEdit82('color',true);body.append(edit);const apply=make('button','chase-apply76 color-apply82','Apply Color');apply.type='button';apply.id='color-apply82';apply.hidden=true;apply.onclick=()=>applyScoped82('color');body.append(apply);const add=make('button','chase-add82','+ Add Chase');add.type='button';add.hidden=true;add.id='color-add82';/* patch 0003: no Add Chase in Color Chase (Movement's Add Chase adds the chase to both lists); invisible spacer keeps both panels aligned */add.disabled=true;add.tabIndex=-1;add.setAttribute('aria-hidden','true');add.style.visibility='hidden';body.append(add);}if(type==='move'){const edit=make('button','chase-edit82','Edit');edit.type='button';edit.id='move-edit82';edit.title='Show the Movement editing buttons';edit.onclick=()=>setEdit82('move',true);body.append(edit);const apply=make('button','chase-apply76','Apply Movement');apply.type='button';apply.id='chase-apply76';apply.hidden=true;apply.title='Apply the changes to this Random chase';apply.onclick=()=>applyChase76();body.append(apply);const add=make('button','chase-add82','+ Add Chase');add.type='button';add.hidden=true;add.id='chase-add82';add.onclick=()=>addChase82('move');body.append(add);}
  const swatches=make('div','radial-palette34');if(type==='color')swatches.append($('palette-list'));else swatches.setAttribute('aria-hidden','true');body.append(swatches);
  body.append(knobs);knobs.classList.add('radial-sliders34');
  for(const row of knobs.querySelectorAll('.knob-control')){const input=row.querySelector('.knob-input'),title=row.querySelector('.knob-title').textContent;input.setAttribute('aria-label',type+' '+title);const paint=()=>{const p=100*(Number(input.value)-Number(input.min))/(Number(input.max)-Number(input.min));input.style.setProperty('--range-progress',`calc(${p}% + ${9-.18*p}px)`);};input.addEventListener('input',paint);row.querySelector('.rotary-knob').tabIndex=-1;}
  const foot=make('div','radial-footer34'),mirror=options.querySelector('.mirror-toggle');mirror.setAttribute('role','switch');mirror.setAttribute('aria-label',type+' Mirror');const mirrorLabel=make('div','radial-mirror34');mirrorLabel.append(make('span','','Mirror'),mirror);mirror.textContent='';mirrorLabel.querySelector('span').onclick=()=>mirror.click();foot.append(mirrorLabel);
  const oldOffset=options.querySelector('input[aria-label="'+type+' Center Offset"]'),offsetLabel=oldOffset.closest('label');offsetLabel.hidden=false;offsetLabel.className='radial-offset34';
  const offsetTop=make('div','radial-offset-top34'),value=make('output','','0');offsetTop.append(make('span','','Center Offset'),value);
  const offsetRow=make('div','radial-offset-row34'),minus=make('button','','−'),plus=make('button','','+');minus.type=plus.type='button';minus.setAttribute('aria-label',type+' decrease Center Offset');plus.setAttribute('aria-label',type+' increase Center Offset');
  oldOffset.type='range';oldOffset.oninput=()=>{oldOffset.onchange();value.textContent=Number(oldOffset.value).toFixed(2);};minus.onclick=()=>{oldOffset.value=Math.max(-1,Number(oldOffset.value)-.05);oldOffset.oninput();};plus.onclick=()=>{oldOffset.value=Math.min(1,Number(oldOffset.value)+.05);oldOffset.oninput();};oldOffset.ondblclick=e=>{e.preventDefault();oldOffset.value=0;oldOffset.oninput();};offsetRow.append(minus,oldOffset,plus);offsetLabel.replaceChildren(offsetTop,offsetRow);foot.append(offsetLabel);body.append(foot);
  // Keep less frequent pre-existing controls accessible without changing the approved face.
  const more=make('details','radial-more34');more.append(make('summary','','More controls'),options);const link=card.querySelector('.engine-link');link.textContent='Link speeds';options.append(link);card.append(more);
  panels.push({card,mirror,oldOffset,value});
 }
 function refresh(){
  for(const {card,mirror,oldOffset,value}of panels){mirror.setAttribute('aria-checked',String(mirror.classList.contains('active')));value.textContent=String(Number(oldOffset.value));for(const r of card.querySelectorAll('.knob-input')){const p=100*(Number(r.value)-Number(r.min))/(Number(r.max)-Number(r.min));r.style.setProperty('--range-progress',`calc(${p}% + ${9-.18*p}px)`);}}
 }
 /* 0.16.76: Random chases. A window between Hold and Stop / Freeze shows the chase that plays (or where Stop stopped);
    the arrows go to the previous / next chase (Stop first if it plays). Colour edits go to that chase and wait for Apply:
    Apply keeps them in the Random sequence (and so in a Look saved afterwards); leaving the chase or Resume without
    Apply puts the chase back as it was. Saving the Look applies pending changes.
    0.16.82: the Color panel and the Movement panel have their OWN chase lists, arrows, Apply and Add Chase.
    Muse 0.16.85 rev.2: the transition block is gone (Cut by default, see engine.js); Apply / Add Chase hide
    behind one Edit button per wheel until Edit is pressed.
    Apply Color keeps only colour changes, Apply Movement only movement changes; the number of chases is not limited. */
 const SCOPES82=['color','move'],snaps82={color:null,move:null};let chaseShown76=null;
 /* Muse 0.16.85 rev.2: under each wheel only one Edit button shows. Edit opens that wheel's Apply / Add Chase
    (and, for Movement, the Position A → B editor); the editors close again on a preset switch or Random.
    Edit is not a toggle: there is no second press to close it. Apply does NOT close the editor — only a
    preset switch or Random does. */
 const editing82={color:false,move:false};
 let look82=null;
 function setEdit82(scope,on){editing82[scope]=!!on;const edit=$(scope==='color'?'color-edit82':'move-edit82'),apply=$(scope==='color'?'color-apply82':'chase-apply76'),add=$(scope==='color'?'color-add82':'chase-add82');if(edit)edit.hidden=editing82[scope];if(apply)apply.hidden=!editing82[scope];if(add)add.hidden=!editing82[scope];if(scope==='move'){if(window.MovementEditor82?.setVisible82)window.MovementEditor82.setVisible82(editing82[scope]);else{const me=document.getElementById('movement-editor82');if(me)me.hidden=!editing82[scope];}}if(editing82[scope]&&scope==='move')window.MovementEditor82?.refresh?.();}
 function closeEdit82(){for(const sc of SCOPES82)if(editing82[sc])setEdit82(sc,false);}
 const state76=()=>typeof lastState==='undefined'?null:lastState;
 const sel82=()=>window.Visualizer?.selectionIds?.()||[];
 const colorKeys82=k=>RandomParts76.isColorScopeKey(k);
 const inScope82=(scope,k)=>colorKeys82(k)===(scope==='color');
 function wheelId82(scope){return scope==='color'?'color-wheel':'move-wheel';}
 function label82(scope){return scope==='color'?'Color':'Movement';}
 function look76(){return show?.looks?.find(l=>l.id===show.look);}
 const info82=scope=>window.RandomParts76?RandomParts76.info(show,state76(),sel82(),scope):null;
 function partsJSON82(scope,index){const l=look76(),out={};for(const [id,o] of Object.entries(l?.fixtureOverrides||{}))if(Array.isArray(o?.random_sequence54)&&o.random_sequence54.length>1){const p=o.random_sequence54[index%o.random_sequence54.length];if(!p)continue;const sub={};for(const k of Object.keys(p))if(inScope82(scope,k))sub[k]=p[k];out[id]=sub;}return JSON.stringify(out);}
 function pending82(scope){const sn=snaps82[scope];return !!sn&&partsJSON82(scope,sn.index)!==sn.json;}
 const pending76=()=>pending82('color')||pending82('move');
 function revert82(scope){if(!pending82(scope))return false;const sn=snaps82[scope],l=look76(),data=JSON.parse(sn.json);for(const [id,sub] of Object.entries(data)){const o=l?.fixtureOverrides?.[id];if(!Array.isArray(o?.random_sequence54))continue;const p=o.random_sequence54[sn.index%o.random_sequence54.length];if(!p)continue;for(const k of Object.keys(p))if(inScope82(scope,k)&&!(k in sub))delete p[k];for(const [k,v] of Object.entries(sub))p[k]=structuredClone(v);}toast(label82(scope)+' Chase '+(sn.slot+1)+' changes were not applied');save(true);renderLive();return true;}
 function revertChase76(){let any=false;for(const sc of SCOPES82)any=revert82(sc)||any;return any;}
 function applyScoped82(scope){const sn=snaps82[scope];if(!sn)return;const was=pending82(scope);sn.json=partsJSON82(scope,sn.index);if(was){save(true);toast(label82(scope)+' Chase '+(sn.slot+1)+' applied');}chase76();}
 /* beats of the change INTO a chase: step value (null = default). Kept for the Movement editor's hidden
    transition select; the transition UI itself was removed in Muse 0.16.85 rev.2. */
 function setStepTransition82(scope,beats){const info=info82(scope);if(!info)return;const l=look76(),ids=sel82(),cands=ids.length?ids:Object.keys(l?.fixtureOverrides||{});for(const id of cands){const o=l?.fixtureOverrides?.[id];if(!Array.isArray(o?.random_sequence54)||RandomParts76.slots(o,scope)<2)continue;const n=RandomParts76.slots(o,scope),arr=Array.from({length:n},(_,i)=>o[scope+'_transitions82']?.[i]??null);arr[Math.min(n-1,info.index)]=beats;o[scope+'_transitions82']=arr.some(v=>v!==null)?arr:undefined;if(o[scope+'_transitions82']===undefined)delete o[scope+'_transitions82'];}save(true);chase76();}
 function addChase82(scope='move'){const l=look76();if(!l)return toast('Select a preset first',true);const overrides=l.fixtureOverrides||{},ids=sel82(),candidates=ids.length?ids:Object.keys(overrides);let added=0,count=0;
  for(const id of candidates){const o=overrides[id];if(!o)continue;let parts=o.random_sequence54;
   if(!Array.isArray(parts)||!parts.length){const base=structuredClone(o);for(const k of ['random_sequence54','motion_sequence53','color_track82','move_track82','color_transitions82','move_transitions82'])delete base[k];o.random_sequence54=parts=[base];}
   if(!Array.isArray(o.color_track82)||!o.color_track82.length)o.color_track82=parts.map((_,i)=>i);
   if(!Array.isArray(o.move_track82)||!o.move_track82.length)o.move_track82=parts.map((_,i)=>i);
   /* only the chosen list grows: a new Color chase never adds a Movement chase and the other way round */
   const track=o[scope+'_track82'],src=Math.min(parts.length-1,Math.max(0,Number(track[track.length-1])||0)),copy=structuredClone(parts[src]);parts.push(copy);track.push(parts.length-1);{const other0003=o[(scope==='color'?'move':'color')+'_track82'];if(Array.isArray(other0003)&&other0003.length)other0003.push(parts.length-1);}added++;count=Math.max(count,track.length);}
  if(!added)return toast('Select fixtures with a preset first',true);for(const sc of SCOPES82)snaps82[sc]=null;save(true);renderLive();toast('Added '+label82(scope)+' Chase '+count);}
 const loopOn84=()=>typeof show!=='undefined'&&!!show&&!!show.chaseLoop84&&show.chaseLoop84.look===show.look;
 /* 0.16.84 Loop: the chase selected by each ring plays on repeat (colour and movement), motion keeps running; the same button leaves Loop */
 function toggleLoop84(){if(typeof show==='undefined'||!show)return;if(loopOn84()){delete show.chaseLoop84;}else{const m=info82('move'),c=info82('color');if(!m&&!c)return toast('Loop needs a Random preset with several chases',true);revertChase76();show.chaseLoop84={look:show.look,move:m?m.index:null,color:c?c.index:null};show.motionFrozen=false;}
  for(const sc of SCOPES82)snaps82[sc]=null;save(true);renderLive();}
 function applyChase76(){applyScoped82('move');}
 /* patch 0004: Color and Movement chases of a hand-made chain are one list. Lists of different length (>=2) are levelled (the shorter one gets the missing chases, which share the same parts); the arrows / Loop of either wheel move both. */function scopes0004(scope){const c=info82('color'),m=info82('move');return c&&m&&c.count===m.count?SCOPES82:[scope];}function link0004(){const l=look76();let ch=false;for(const o of Object.values(l?.fixtureOverrides||{})){const c=o?.color_track82,m=o?.move_track82;if(!Array.isArray(o?.random_sequence54)||!Array.isArray(c)||!Array.isArray(m)||c.length<2||m.length<2||c.length===m.length)continue;const short=c.length<m.length?c:m,long=c.length<m.length?m:c;for(let i=short.length;i<long.length;i++)short.push(long[i]);ch=true;}if(ch){for(const sc of SCOPES82)snaps82[sc]=null;save(true);}}function stepChase76(step,scope='move'){const info=info82(scope);if(!info)return;revertChase76();if(loopOn84()){const nx=(info.index+step+info.count)%info.count;for(const sc0004 of scopes0004(scope))if(sc0004===scope||Number.isInteger(show.chaseLoop84[sc0004]))show.chaseLoop84[sc0004]=nx;const nn=$(wheelId82(scope))?.querySelector('.radial-chase-number76');if(nn)nn.textContent=String(nx+1);for(const sc of SCOPES82)snaps82[sc]=null;save(true);renderLive();return;}if(!show.motionFrozen)show.motionFrozen=true;const nv0004=((Math.round(Number(show[scope+'ChaseOffset82'])||0)+step)%info.count+info.count)%info.count;for(const sc0004 of scopes0004(scope))show[sc0004+'ChaseOffset82']=nv0004;
  const shown=(info.index+step+info.count)%info.count,n=$(wheelId82(scope))?.querySelector('.radial-chase-number76');if(n)n.textContent=String(shown+1);for(const sc of SCOPES82)snaps82[sc]=null;save(true);renderLive();}
 for(const type of ['look-update','save-look','save-current-live','save-current-viz'])$(type)?.addEventListener('click',()=>{for(const sc of SCOPES82){const sn=snaps82[sc];if(sn)sn.json=partsJSON82(sc,sn.index);}},true);
 function lookReset0008(){const l=show?.look;if(window.lastLook0008===undefined){window.lastLook0008=l;return;}if(l===window.lastLook0008)return;window.lastLook0008=l;let ch=false;for(const k of ['moveChaseOffset82','colorChaseOffset82','randomChaseOffset76','chaseBack76'])if(show[k]){delete show[k];ch=true;}if(show.chasePrev82&&Object.keys(show.chasePrev82).length){delete show.chasePrev82;ch=true;}if(ch){for(const sc of SCOPES82)snaps82[sc]=null;save(true);}}function chase76(){if(typeof show==='undefined'||!show||!window.RandomParts76)return;lookReset0008();link0004();const texts=[];
  /* Muse 0.16.85 rev.2: a preset switch closes the wheel editors (Edit returns). */
  if(look82!==null&&show.look!==look82)closeEdit82();look82=show.look;
  for(const scope of SCOPES82){const info=info82(scope),text=RandomParts76.label(info),wheel=$(wheelId82(scope)),key=info?show.look+'|'+(show.randomComposition38?.count??'')+'|'+info.index:null,snap=snaps82[scope];texts.push(text);
   if(!key)snaps82[scope]=null;else if(snap?.key!==key){/* the chase moved on (playing) without Apply: it stays as it was */if(snap&&snap.key.split('|').slice(0,2).join('|')===key.split('|').slice(0,2).join('|'))revert82(scope);snaps82[scope]={key,index:info.part??info.index,slot:info.index,json:partsJSON82(scope,info.part??info.index)};}
   const group=wheel?.querySelector('.radial-chase76');if(group){group.hidden=!info;if(group.hidden)group.setAttribute('display','none');else group.removeAttribute('display');const n=group.querySelector('.radial-chase-number76'),t=info?String(info.index+1):'';if(n.textContent!==t)n.textContent=t;group.classList.toggle('frozen76',!!show.motionFrozen);
    for(const a of group.querySelectorAll('.radial-chase-arrow76'))if(!a.onclick)keyActivate(a,()=>stepChase76(Number(a.dataset.step),scope));}
   /* Muse 0.16.85 rev.2: the transition block is gone; Edit / Apply / Add Chase follow the edit state. */
   const edit=$(scope==='color'?'color-edit82':'move-edit82');if(edit)edit.hidden=editing82[scope];
   const add=$(scope==='color'?'color-add82':'chase-add82');if(add)add.hidden=!editing82[scope];
   const apply=$(scope==='color'?'color-apply82':'chase-apply76'),pend=pending82(scope);if(apply){apply.hidden=!editing82[scope]||!info;apply.disabled=!pend;apply.classList.toggle('pending76',pend);apply.textContent=scope==='color'?'Apply Color':'Apply Movement';}
   const head=document.querySelector(scope==='color'?'.color-card .card-head':'.move-card .card-head');if(head){let badge=head.querySelector('.chase-badge76');if(!badge){badge=make('span','chase-badge76');head.querySelector('span')?.after(badge);}badge.textContent=text?(show.motionFrozen?'■ ':'▶ ')+text:'';badge.hidden=!text;badge.title=text?label82(scope)+' chase (independent from the '+(scope==='color'?'Movement':'Color')+' chase)':'';}}
  const k2=texts.join('/')+'|'+!!show.motionFrozen;if(k2===chaseShown76)return;const changed=chaseShown76!==null&&chaseShown76.split('|')[0]!==texts.join('/');chaseShown76=k2;
  /* the Color Chase panel shows the colours of the chase now playing */
  if(changed&&texts.join('')&&typeof renderLive==='function'&&!document.activeElement?.closest?.('.color-card,#palette-list,.reference-details'))setTimeout(()=>renderLive(),0);}
 /* site fix: chase76 -> revert82 -> renderLive -> bb-live-render -> chase76 recursed without end; skip re-entry */let busy76s=false;const safe76s=()=>{if(busy76s)return;busy76s=true;try{chase76();}finally{busy76s=false;}};document.addEventListener('bb-live-render',safe76s);setInterval(safe76s,200);
 /* Muse 0.16.85 rev.2: Random closes the wheel editors too. The button, the D6 and voice commands all funnel
    through BitBeamRandom.roll, so wrap it once (and also listen to the button itself). */
 $('auto-look')?.addEventListener('click',closeEdit82);
 if(typeof window!=='undefined'&&window.BitBeamRandom&&!window.BitBeamRandom._closeEdit82){const roll=window.BitBeamRandom.roll;window.BitBeamRandom.roll=(...a)=>{closeEdit82();return roll(...a);};window.BitBeamRandom._closeEdit82=true;}
 window.ControlValues35?.setChaseResolver?.((s,f,o,why)=>(s.motionFrozen||why==='read')&&window.RandomParts76?RandomParts76.index(state76(),f.id,o):null);
 document.addEventListener('bb-live-render',refresh);
 window.RadialPanels34={toggleLoop84,loopOn84,wheel,drawWheel,refresh,chase76,stepChase76,applyChase76,applyScoped82,addChase82,revertChase76,setStepTransition82,setEdit82,closeEdit82};
 if(typeof show!=='undefined'&&show)renderLive();
})();
