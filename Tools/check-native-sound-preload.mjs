import assert from 'node:assert/strict';
import {preloadNativeSounds} from '../Engine/native-sound-preload.js';

const resources=Array.from({length:19},(_,index)=>({url:`sound-${index}.flac`,metadata:{index}})),seen=[];
let active=0,peak=0;
const loader={async load(url,metadata){active++;peak=Math.max(peak,active);await new Promise(resolve=>setTimeout(resolve,1));seen.push([url,metadata]);active--;}};
assert.equal(await preloadNativeSounds(loader,resources,{concurrency:3}),19);
assert.equal(peak,3);
assert.equal(active,0);
assert.deepEqual(seen.map(entry=>entry[0]).sort(),resources.map(entry=>entry.url).sort());
for(const [url,metadata] of seen)assert.equal(metadata,resources.find(resource=>resource.url===url).metadata);
assert.equal(await preloadNativeSounds(loader,[]),0);
await assert.rejects(preloadNativeSounds(loader,resources,{concurrency:0}),/concurrency/);
await assert.rejects(preloadNativeSounds({load:async()=>{throw Error('decode failed')}},resources),/decode failed/);
console.log('Native sound preloading waits for every resource, bounds concurrent decoding, preserves metadata and propagates failures');
