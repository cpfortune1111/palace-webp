import {openAssetPack} from './encrypted-assets.js';
let started=false,token;window.__ikemenBootLog=[];window.__palaceControl={paused:false};
const emit=(kind,value)=>parent.postMessage({palaceWasm:1,token,kind,value},location.origin);
window.__palaceEmit=(kind,value)=>{let parsed;try{parsed=JSON.parse(value)}catch{parsed=value}emit(kind,parsed)};
window.addEventListener('message',async event=>{
 if(event.source!==parent||event.origin!==location.origin||!event.data?.palaceWasm)return;
 const message=event.data;
 if(message.kind==='start'&&!started){started=true;token=message.token;
  try{window.__palaceConfig=JSON.stringify(message.config);const pack=await openAssetPack(new URL(message.pack,location.href));window.__palaceAssets=pack;
   const atlasCache=new Map(),atlasPending=new Map();let atlasStamp=0;
   const imageStats=window.__palaceImageStats={bytes:0,peak:0,decodes:0};
   function trimAtlases(){while(imageStats.bytes>128*1024*1024){let victim;for(const entry of atlasCache.values())if(!entry.users&&(!victim||entry.stamp<victim.stamp))victim=entry;if(!victim)break;atlasCache.delete(victim.name);imageStats.bytes-=victim.bytes;victim.bitmap.close()}}
   async function acquireAtlas(name){
    let entry=atlasCache.get(name);
    if(!entry){if(!atlasPending.has(name))atlasPending.set(name,(async()=>{const bytes=await pack.read(name);const bitmap=await createImageBitmap(new Blob([bytes],{type:pack.files[name].mime}),{premultiplyAlpha:'premultiply',colorSpaceConversion:'none'});imageStats.decodes++;return {name,bitmap,bytes:bitmap.width*bitmap.height*4,users:0,stamp:0}})().finally(()=>atlasPending.delete(name)));entry=await atlasPending.get(name);if(!atlasCache.has(name)){atlasCache.set(name,entry);imageStats.bytes+=entry.bytes;imageStats.peak=Math.max(imageStats.peak,imageStats.bytes)}}
    entry.users++;entry.stamp=++atlasStamp;return entry;
   }
   if(typeof createImageBitmap==='function'){
    window.__palaceAtlasReady=name=>atlasCache.has(name);
    window.__palaceDecodeSprite=async(name,x,y,width,height,done)=>{let atlas;try{atlas=await acquireAtlas(name);const bitmap=await createImageBitmap(atlas.bitmap,x,y,width,height,{premultiplyAlpha:'premultiply',colorSpaceConversion:'none'});done(null,bitmap)}catch(error){done(String(error),null)}finally{if(atlas){atlas.users--;trimAtlases()}}};
   }
   const prefetchQueue=[];let prefetchActive=0;
   function drainPrefetch(){while(prefetchActive<2&&prefetchQueue.length){const name=prefetchQueue.shift();prefetchActive++;const task=typeof createImageBitmap==='function'?acquireAtlas(name).then(entry=>{entry.users--;trimAtlases()}):pack.read(name);task.catch(error=>console.warn('Animation prefetch',error)).finally(()=>{prefetchActive--;drainPrefetch()})}}
   window.__palacePrefetch=name=>{prefetchQueue.push(name);drainPrefetch()};
   mountExternalFiles(pack.files,'/ikemen',name=>pack.read(name));process.chdir('/ikemen');
   const go=new Go();go.argv=['ikemen','-config','config.ini','-windowed'];go.exit=code=>emit('exit',code);
   const hashes=await fetch('Host/artifact-hashes.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('Engine integrity manifest unavailable');return r.json()});
   const response=await fetch('Host/ikemen.wasm.gz?v='+hashes['ikemen.wasm'].sha256);if(!response.ok)throw Error('Engine HTTP '+response.status);
   const bytes=await new Response(response.body.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();
   const actual=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),v=>v.toString(16).padStart(2,'0')).join('');
   if(actual!==hashes['ikemen.wasm'].sha256||bytes.byteLength!==hashes['ikemen.wasm'].bytes)throw Error('Engine integrity check failed');
   const {instance}=await WebAssembly.instantiate(bytes,go.importObject);window.__palaceWasm=instance;
   go.run(instance).catch(error=>emit('error',String(error)));emit('booted',{});
  }catch(error){emit('error',String(error))}
 }
 if(message.token!==token)return;
 if(message.kind==='control')Object.assign(window.__palaceControl,message.control);
 if(message.kind==='input'){const {code,key,down}=message;dispatchEvent(new KeyboardEvent(down?'keydown':'keyup',{code,key:key||code,bubbles:true}));window.__ikemenResumeAudio?.()}
});
for(const name of ['pointerdown','keydown'])addEventListener(name,()=>window.__ikemenResumeAudio?.());
emit('frameReady',{});
