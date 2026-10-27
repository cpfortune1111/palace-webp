// Route unchanged historical files to the hash-identical frozen backup.
// Revision 02408r4: refresh the map when switching from an already-open older test.
// Return a fresh Response so module-relative URLs retain the test namespace.
const base=new URL('./',self.location.href);
const mapping=fetch(new URL('asset-map.json',base),{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('Snapshot map unavailable');return r.json()});
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);if(url.origin!==base.origin||!url.pathname.startsWith(base.pathname))return;
 const name=decodeURIComponent(url.pathname.slice(base.pathname.length));
 if(['asset-map.json','snapshot-worker.js','index.html',''].includes(name))return;
 event.respondWith((async()=>{const map=await mapping,target=map[name];if(!target)return fetch(event.request);
  const response=await fetch(new URL(target,base),{headers:event.request.headers});
  const headers=new Headers(response.headers);headers.delete('Content-Encoding');headers.delete('Content-Length');
  return new Response(response.body,{status:response.status,statusText:response.statusText,headers});
 })());
});
