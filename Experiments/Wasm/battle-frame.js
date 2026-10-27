import {openAssetLibrary} from './asset-library.js?battle-ready=2';
let started=false,token,library,mediaTotals={graphics:1,sounds:1};window.__ikemenBootLog=[];window.__palaceControl={paused:false};
const emit=(kind,value)=>parent.postMessage({palaceWasm:1,token,kind,value},location.origin);
window.__palaceLoading=(phase,graphics=0,sounds=0)=>emit('loading',{phase,graphics,sounds,progress:Math.min(.99,.45+.4*Math.min(1,graphics/mediaTotals.graphics)+.14*Math.min(1,sounds/mediaTotals.sounds))});
window.__palaceEmit=(kind,value)=>{
 let parsed;try{parsed=JSON.parse(value)}catch{parsed=value}
 if(kind==='snapshot'&&!library.metrics.sealed){library.seal();window.__palacePreparation.completedAt=performance.now();window.__palacePreparation.networkAtReady=library.metrics.networkRequests;window.__palacePreparation.graphicsAtReady=parsed.streaming?.uploads;window.__palacePreparation.soundsAtReady=parsed.streaming?.soundLoads;window.__palaceClearAtlases?.();emit('prepared',window.__palacePreparation)}
 emit(kind,parsed);
};
addEventListener('message',async event=>{
 if(event.source!==parent||event.origin!==location.origin||!event.data?.palaceWasm)return;const message=event.data;
 if(message.kind==='start'&&!started){started=true;token=message.token;try{
  window.__palaceConfig=JSON.stringify(message.config);window.__palaceAudioContext=parent.__palaceBattleAudioContext;window.__palaceSharedAudio=!!window.__palaceAudioContext;
  library=await openAssetLibrary(new URL(message.pack,location.href),{players:message.config.players,stage:message.config.stage});window.__palaceAssets=library;
  window.__palacePreparation={startedAt:performance.now(),files:Object.keys(library.files).length,groups:library.metrics.groups};
  await library.preload((progress,name)=>emit('loading',{phase:'Loading complete battle resources',progress:progress*.45,name}));
  const decode=new TextDecoder();for(const name of Object.keys(library.files)){if(name.endsWith('.pms'))mediaTotals.graphics+=JSON.parse(decode.decode(library.borrow(name))).sprites.length;if(name.endsWith('.pma'))mediaTotals.sounds+=JSON.parse(decode.decode(library.borrow(name))).sounds.length}
  // All encoded assets are resident before the engine opens its first file.
  mountExternalFiles(library.files,'/ikemen',name=>Promise.resolve(library.borrow(name)));process.chdir('/ikemen');
  const atlases=new Map();let decodeQueue=Promise.resolve(),atlasBytes=0;
  window.__palaceClearAtlases=()=>{for(const bitmap of atlases.values())bitmap.close();atlases.clear();atlasBytes=0};
  window.__palaceSoundCue=(group,number,source)=>{const context=window.__palaceAudioContext,metrics=context?.__palaceMetrics;if(metrics){(metrics.cues??=[]).push({group,number,source,audioTime:context.currentTime,at:performance.now()});if(metrics.cues.length>256)metrics.cues.shift()}};
  window.__palaceDecodeSprite=(name,x,y,width,height,done)=>{decodeQueue=decodeQueue.then(async()=>{try{
   if(library.metrics.sealed)throw Error('Graphics decode attempted after battle readiness');
   if(!atlases.has(name)){const bytes=library.borrow(name),bitmap=await createImageBitmap(new Blob([bytes],{type:library.files[name].mime}),{premultiplyAlpha:'premultiply',colorSpaceConversion:'none'});atlases.set(name,bitmap);atlasBytes+=bitmap.width*bitmap.height*4}
   const image=atlases.get(name);atlases.delete(name);atlases.set(name,image);while(atlasBytes>256*1024*1024&&atlases.size>1){const first=atlases.keys().next().value,bitmap=atlases.get(first);atlasBytes-=bitmap.width*bitmap.height*4;bitmap.close();atlases.delete(first)}
   if(x<0||y<0||x+width>image.width||y+height>image.height)throw Error('Invalid sprite bounds');
   done(null,await createImageBitmap(image,x,y,width,height,{premultiplyAlpha:'premultiply',colorSpaceConversion:'none'}));
  }catch(error){done(String(error),null)}})};
  const go=new Go();go.argv=['ikemen','-config','config.ini','-windowed'];go.exit=code=>emit('exit',code);
  const hashes=await fetch('Host/artifact-hashes.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('Engine manifest unavailable');return r.json()});
  const response=await fetch('Host/ikemen.wasm.gz?v='+hashes['ikemen.wasm'].sha256);if(!response.ok)throw Error('Engine HTTP '+response.status);
  const bytes=await new Response(response.body.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer(),actual=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),v=>v.toString(16).padStart(2,'0')).join('');
  if(actual!==hashes['ikemen.wasm'].sha256||bytes.byteLength!==hashes['ikemen.wasm'].bytes)throw Error('Engine integrity check failed');
  const {instance}=await WebAssembly.instantiate(bytes,go.importObject);window.__palaceWasm=instance;go.run(instance).catch(error=>emit('error',String(error)));emit('booted',{});
 }catch(error){emit('error',String(error))}}
 if(message.token!==token)return;
 if(message.kind==='control')Object.assign(window.__palaceControl,message.control);
 if(message.kind==='input'){dispatchEvent(new KeyboardEvent(message.down?'keydown':'keyup',{code:message.code,key:message.key||message.code,bubbles:true}));window.__ikemenResumeAudio?.()}
});
emit('frameReady',{});
