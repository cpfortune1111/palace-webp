import {openAssetPack} from './encrypted-assets.js';
let packPromise;
const siteRoot=new URL('../../',self.location.href).pathname;
const configKey=new URL('./__pack-config__',self.location.href).href;
const uiAdapters=new Set(['palace-menu.js','quote-animation.js','declaration-screen.js','acs-screen.js','result-declaration-screen.js']);
async function currentPack(){if(!packPromise)packPromise=(async()=>{const saved=await(await caches.open('palace-wasm-config-v1')).match(configKey);if(!saved)throw Error('Protected asset service is not initialized');return openAssetPack(await saved.text())})();return packPromise}
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('message',event=>{
 if(event.data?.type!=='palace-pack')return;
 const url=new URL(event.data.url,self.location.href);if(url.origin!==self.location.origin)return;
 packPromise=openAssetPack(url.href);
 event.waitUntil(packPromise.then(async pack=>{await(await caches.open('palace-wasm-config-v1')).put(configKey,new Response(url.href));event.ports[0]?.postMessage({ok:true,files:Object.keys(pack.files).length})},error=>event.ports[0]?.postMessage({ok:false,error:String(error)})));
});
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);if(url.origin!==self.location.origin||!url.pathname.startsWith(siteRoot))return;
 const name=decodeURIComponent(url.pathname.slice(siteRoot.length));
 if(name.startsWith('Experiments/Wasm/'))return;
 event.respondWith((async()=>{
  if(name.startsWith('Engine/')&&uiAdapters.has(name.slice(7))){
   const response=await fetch(new URL('./Ui/'+name.slice(7),self.location.href),{cache:'no-store'});
   if(!response.ok)throw Error('UI adapter unavailable');
   return new Response(await response.arrayBuffer(),{headers:{'Content-Type':'text/javascript','Cache-Control':'no-store'}});
  }
  const pack=await currentPack(),entry=pack.files[name];
  if(!entry){if(/\.(?:png|webp|jpe?g|wav|ogg|mp3|flac|glb|glb\.gz|ttf|woff2?|sff|snd)$/i.test(name))return new Response('Packed asset unavailable',{status:404});return fetch(event.request)}
  const bytes=await pack.read(name);let body=bytes,status=200;const headers={'Content-Type':entry.mime,'Accept-Ranges':'bytes','Cache-Control':'no-store'};
  const range=event.request.headers.get('Range');
  if(range){const match=/^bytes=(\d+)-(\d*)$/.exec(range);if(!match)return new Response(null,{status:416});const start=Number(match[1]),end=match[2]?Math.min(Number(match[2]),bytes.length-1):bytes.length-1;if(start>end||start>=bytes.length)return new Response(null,{status:416});status=206;body=bytes.slice(start,end+1);headers['Content-Range']=`bytes ${start}-${end}/${bytes.length}`}
  headers['Content-Length']=String(body.length);return new Response(body,{status,headers});
 })());
});
