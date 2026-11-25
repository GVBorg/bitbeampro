/* D6: numbered Looks in the selected bank, using the same order and recall as Live.
   0.16.80 live buttons: status() feeds the FIFINE Control Deck plugin so the active scene is lit on the D6. */
(function(root){
  const COLOR=/^#[0-9a-f]{6}$/i;
  function ordered(show,limit=15){return (show?.looks||[]).filter(l=>l.bank===(show.controlOne?.bank||0)).sort((a,b)=>a.slot-b.slot).slice(0,limit);}
  function trigger(show,number,recall){
    if(!Number.isInteger(number)||number<1||number>15)return {ok:false,reason:'invalid'};
    const look=ordered(show)[number-1];
    if(!look)return {ok:false,reason:'empty'};
    // Holding a key or pressing the active scene again must not restart its effects.
    const repeated=show.look===look.id&&show.mode==='live';
    if(!repeated)recall(look.id);
    return {ok:true,id:look.id,name:look.name,repeated};
  }
  // images: {lookId: version} of key pictures stored in BitBeam (optional).
  function buttons(show,images,limit=15){
    const list=ordered(show,limit);
    return Array.from({length:limit},(_,i)=>{
      const l=list[i];if(!l)return null;
      const color=COLOR.test(l.color||'')?l.color:'#8a8f99';
      const palette=(Array.isArray(l.palette)?l.palette:[]).filter(c=>typeof c==='string'&&COLOR.test(c)).slice(0,4);
      const image=images&&Object.hasOwn(images,l.id)?String(images[l.id]):null;
      return {n:i+1,id:String(l.id),name:String(l.name||('Look '+(i+1))).slice(0,60),color,palette,image};
    });
  }
  // activeId: the Look actually playing (in a running chase this follows the playhead).
  function status(show,activeId,images){
    const list=buttons(show,images),id=activeId??show?.look??null,index=list.findIndex(b=>b&&b.id===id);
    const playing=(show?.looks||[]).find(l=>l.id===id);
    return {app:'beatbeam',format:1,bank:(show?.controlOne?.bank||0)+1,mode:show?.mode==='timeline'?'chase':'live',
      blackout:!!show?.blackout,active:index>=0?index+1:0,activeName:playing?String(playing.name||'').slice(0,60):'',
      activeBank:playing?(playing.bank||0)+1:0,activeId:id,looks:buttons(show,images,(show?.looks||[]).length).filter(Boolean),buttons:list};
  }
  const api={ordered,trigger,buttons,status};
  if(typeof module==='object'&&module.exports){module.exports=api;return;}
  root.BBD6=api;
  root.beatbeamDesktop?.onD6Look?.(number=>{
    const s=typeof show==='undefined'?null:show;
    if(!s||!root.Studio?.recall)return;
    const result=trigger(s,number,id=>root.Studio.recall(id));
    if(typeof toast==='function')toast(result.ok?'D6 '+number+' · '+result.name:'D6 '+number+' · No Look in this bank',!result.ok);
  });
})(typeof window==='object'?window:globalThis);
