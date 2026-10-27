const hex=bytes=>Array.from(new Uint8Array(bytes),v=>v.toString(16).padStart(2,'0')).join('');
const unhex=text=>Uint8Array.from(text.match(/../g)||[],x=>parseInt(x,16));
const inflate=async bytes=>new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer());
export async function openAssetPack(manifestUrl,{fetcher=fetch,cacheBytes=32*1024*1024}={}){
 const base=new URL(manifestUrl,globalThis.location?.href||'http://localhost/');
 const response=await fetcher(base);if(!response.ok)throw Error('Asset manifest HTTP '+response.status);const manifest=await response.json();
 if(manifest.version!==1||manifest.algorithm!=='AES-256-GCM')throw Error('Unsupported asset pack');
 const raw=unhex(manifest.keyParts[0]);const mask=unhex(manifest.keyParts[1]);if(raw.length!==32||mask.length!==32)throw Error('Invalid asset key');for(let i=0;i<32;i++)raw[i]^=mask[i];
 const key=await crypto.subtle.importKey('raw',raw,'AES-GCM',false,['decrypt']);raw.fill(0);
 async function checked(bytes,sha){if(hex(await crypto.subtle.digest('SHA-256',bytes))!==sha)throw Error('Asset integrity check failed');return bytes}
 const indexResponse=await fetcher(new URL(manifest.index.file,base));if(!indexResponse.ok)throw Error('Asset index HTTP '+indexResponse.status);
 const indexCipher=await checked(new Uint8Array(await indexResponse.arrayBuffer()),manifest.index.sha256);
 const index=JSON.parse(new TextDecoder().decode(await inflate(await crypto.subtle.decrypt({name:'AES-GCM',iv:unhex(manifest.index.iv),additionalData:new TextEncoder().encode('palace-catalog-v1')},key,indexCipher))));
 const cache=new Map(),pending=new Map();let used=0;const metrics={files:0,networkBytes:0,cacheBytes:0};
 function retain(name,data){if(data.length>cacheBytes)return;while(used+data.length>cacheBytes&&cache.size){const first=cache.keys().next().value;used-=cache.get(first).length;cache.delete(first)}cache.set(name,data);used+=data.length;metrics.cacheBytes=used}
 const fullBundles=new Map(),bundlePending=new Map();let fullBytes=0;
 async function encryptedChunk(part){
  const cached=fullBundles.get(part.file);
  if(cached){fullBundles.delete(part.file);fullBundles.set(part.file,cached);return cached.slice(part.offset,part.offset+part.size)}
  // Coalesce the first request, which also detects servers that ignore Range.
  if(bundlePending.has(part.file)){await bundlePending.get(part.file);if(fullBundles.has(part.file))return encryptedChunk(part)}
  const request=(async()=>{
   const r=await fetcher(new URL(part.file,base),{headers:{Range:'bytes='+part.offset+'-'+(part.offset+part.size-1)}});
   if(!r.ok)throw Error('Asset chunk HTTP '+r.status);
   let b=new Uint8Array(await r.arrayBuffer());metrics.networkBytes+=b.length;
   if(r.status===200){
    const expected=manifest.bundles.find(item=>item.file===part.file);
    if(!expected||b.length!==expected.size||b.length<part.offset+part.size)throw Error('Invalid asset bundle');
    await checked(b,expected.sha256);
    if(b.length<=16*1024*1024){while(fullBytes+b.length>16*1024*1024&&fullBundles.size){const first=fullBundles.keys().next().value;fullBytes-=fullBundles.get(first).length;fullBundles.delete(first)}fullBundles.set(part.file,b);fullBytes+=b.length}
    return b.slice(part.offset,part.offset+part.size);
   }
   if(r.status!==206||b.length!==part.size)throw Error('Invalid asset range');
   return b;
  })();
  bundlePending.set(part.file,request);
  try{return await request}finally{if(bundlePending.get(part.file)===request)bundlePending.delete(part.file)}
 }
 async function chunk(part){return new Uint8Array(await crypto.subtle.decrypt({name:'AES-GCM',iv:unhex(part.iv),additionalData:new TextEncoder().encode(part.id)},key,await encryptedChunk(part)))}
 async function load(name){const entry=index.files[name];if(!entry)throw Error('Asset unavailable: '+name);const pieces=new Array(entry.parts.length);let next=0;await Promise.all(Array.from({length:Math.min(4,entry.parts.length)},async()=>{for(;;){const index=next++;if(index>=entry.parts.length)return;pieces[index]=await chunk(entry.parts[index])}}));let bytes=new Uint8Array(pieces.reduce((n,b)=>n+b.length,0)),offset=0;for(const b of pieces){bytes.set(b,offset);offset+=b.length}if(entry.encoding==='gzip')bytes=await inflate(bytes);if(bytes.length!==entry.size)throw Error('Asset size mismatch');await checked(bytes,entry.sha256);retain(name,bytes);metrics.files++;return bytes}
 async function read(name){if(cache.has(name)){const b=cache.get(name);cache.delete(name);cache.set(name,b);return b.slice()}if(!pending.has(name))pending.set(name,load(name).finally(()=>pending.delete(name)));return (await pending.get(name)).slice()}
 return {read,files:index.files,metrics,manifest};
}
