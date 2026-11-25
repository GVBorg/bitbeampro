/* BitBeam GitHub Pages offline simulator. No hardware/network output. */
(()=>{'use strict';
const nativeFetch=window.fetch.bind(window), NativeEventSource=window.EventSource;
let show=null,revision=1,history=[],redo=[],playing=false,position=0;
const reply=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json'}});
function current(){if(!show){if(!window.Engine)throw Error('Engine not loaded');show=Engine.upgradeShow(Engine.defaultShow());}return show;}
function snapshot(){const s=current(),now=performance.now()/1000;let rendered={preview:[],frame:[]};try{rendered=Engine.renderBase({...s,motionNow:now,motionEpoch:0},now,position,0,[]);}catch(e){console.warn('BitBeam preview',e)}
return {show:s,revision,preview:rendered.preview||[],dmx:rendered.frame||[],position,playing,can_undo:history.length>0,can_redo:redo.length>0,output:'simulator',connected:1,host:'GitHub Pages',bpm:s.bpm,charts_revision:0,audio_levels:[],beatClock110:{bpm:s.bpm||120,beatPosition:now*(s.bpm||120)/60,hostWallMs:Date.now()}};}
window.fetch=async(input,init={})=>{const url=new URL(typeof input==='string'?input:input.url,location.href);if(!url.pathname.startsWith('/api/'))return nativeFetch(input,init);const path=url.pathname.slice(5);let body={};try{body=JSON.parse(init.body||'{}')}catch{}
try{
 if(path==='state')return reply(snapshot());
 if(path==='show'){if(body.show){history.push(structuredClone(current()));if(history.length>30)history.shift();redo=[];show=Engine.upgradeShow(body.show);revision++;}return reply({ok:true,revision,can_undo:history.length>0,can_redo:redo.length>0});}
 if(path==='history'){if(body.action==='undo'&&history.length){redo.push(structuredClone(current()));show=history.pop();revision++}else if(body.action==='redo'&&redo.length){history.push(structuredClone(current()));show=redo.pop();revision++}return reply(snapshot());}
 if(path==='queue-look'){const id=body.look||body.id||body.lookId;if(id&&current().looks.some(x=>x.id===id)){show.look=id;revision++}return reply({ok:true,queued:false,revision});}
 if(path==='queue-random')return reply({ok:true,queued:false,revision});
 if(path==='ui-state')return reply(init.method==='POST'?{ok:true}:{});
 if(path==='stage-cmd12')return reply({last:0,cmds:[]});
 if(path==='charts')return reply({charts:[],revision:0});
 if(path==='modules')return reply({modules:[]});
 if(path==='usb')return reply({devices:[],hint:'Browser demo: USB DMX is disabled.'});
 if(path==='link')return reply({active:false,connected:false});
 if(path==='learning')return reply({});
 if(path==='track-player')return reply({playing:false});
 return reply({ok:true,revision,preview:snapshot().preview});
}catch(e){console.error('BitBeam demo API',path,e);return reply({error:e.message},500)}
};
window.EventSource=class{constructor(url){this.url=url;this.onmessage=null;this.onerror=null;this.interval=setInterval(()=>{try{if(this.onmessage)this.onmessage({data:JSON.stringify(snapshot())})}catch(e){console.warn(e)}},130)}close(){clearInterval(this.interval)}};
})();