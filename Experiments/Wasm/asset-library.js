import {openAssetPack} from './encrypted-assets.js?battle-ready=2';
export async function openAssetLibrary(url,{players,stage,fetcher=fetch}={}){
 const base=new URL(url,globalThis.location?.href||'http://localhost/'),response=await fetcher(base,{cache:'no-store'});
 if(!response.ok)throw Error('Asset library HTTP '+response.status);const catalog=await response.json();
 if(catalog.version!==2)throw Error('Asset library version mismatch');
 const paths=players?[catalog.shared,...new Set(players.map(id=>catalog.characters[id])),catalog.stages[stage]]:[catalog.interface,catalog.presentation];
 if(paths.some(path=>!path))throw Error('Missing battle resource group');
 const owners=new Map(),files={},resident=new Map();let sealed=false;
 const metrics={groups:[...paths],files:0,bytes:0,networkRequests:0,networkBytes:0,missesAfterReady:0,sealed:false};
 const checkedFetch=async(...args)=>{if(sealed){metrics.missesAfterReady++;throw Error('Combat attempted a resource download')}metrics.networkRequests++;const result=await fetcher(...args);return result};
 // Keep the single presentation bundle when hosting ignores HTTP Range.
 const packs=await Promise.all(paths.map(path=>openAssetPack(new URL(path,base),{fetcher:checkedFetch,cacheBytes:players?0:32*1024*1024,bundleCacheBytes:players||path===catalog.presentation?Infinity:16*1024*1024})));
 for(const pack of packs)for(const[name,entry]of Object.entries(pack.files)){if(owners.has(name)&&files[name].sha256!==entry.sha256)throw Error('Conflicting resource '+name);owners.set(name,pack);files[name]=entry}
 async function read(name){if(resident.has(name))return resident.get(name).slice();if(sealed){metrics.missesAfterReady++;throw Error('Unprepared combat resource '+name)}const owner=owners.get(name);if(!owner)throw Error('Asset unavailable: '+name);return owner.read(name)}
 async function preload(progress=()=>{}){
  if(players)await Promise.all(packs.map(pack=>pack.warmBundles()));
  const names=Object.keys(files);let next=0,done=0;
  await Promise.all(Array.from({length:6},async()=>{for(;;){const index=next++;if(index>=names.length)return;const name=names[index],bytes=await read(name);resident.set(name,bytes);metrics.bytes+=bytes.length;metrics.files++;progress(++done/names.length,name)}}));
  metrics.networkBytes=packs.reduce((sum,pack)=>sum+pack.metrics.networkBytes,0);
  if(players)for(const pack of packs)pack.dropBundles();
 }
 function borrow(name){if(!resident.has(name)){metrics.missesAfterReady++;throw Error('Combat resource was not preloaded: '+name)}return resident.get(name)}
 return {files,read,borrow,preload,metrics,seal(){sealed=true;metrics.sealed=true},catalog};
}
