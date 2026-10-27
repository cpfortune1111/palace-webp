import {openAssetPack} from './encrypted-assets.js';
let started=false,token;window.__ikemenBootLog=[];window.__palaceControl={paused:false};
const emit=(kind,value)=>parent.postMessage({palaceWasm:1,token,kind,value},location.origin);
window.__palaceEmit=(kind,value)=>{let parsed;try{parsed=JSON.parse(value)}catch{parsed=value}emit(kind,parsed)};
window.addEventListener('message',async event=>{
 if(event.source!==parent||event.origin!==location.origin||!event.data?.palaceWasm)return;
 const message=event.data;
 if(message.kind==='start'&&!started){started=true;token=message.token;
  try{window.__palaceConfig=JSON.stringify(message.config);const pack=await openAssetPack(new URL(message.pack,location.href));window.__palaceAssets=pack;
   mountExternalFiles(pack.files,'/ikemen',name=>pack.read(name));process.chdir('/ikemen');
   const go=new Go();go.argv=['ikemen','-config','config.ini','-windowed'];go.exit=code=>emit('exit',code);
   const response=await fetch('Host/ikemen.wasm.gz');if(!response.ok)throw Error('Engine HTTP '+response.status);
   const bytes=await new Response(response.body.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();
   const hashes=await fetch('Host/artifact-hashes.json').then(r=>{if(!r.ok)throw Error('Engine integrity manifest unavailable');return r.json()});
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
