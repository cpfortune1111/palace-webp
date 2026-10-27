import assert from 'node:assert/strict';
import {createNativeSoundLoader} from '../Engine/native-sound-loader.js';

const metadata={sourceSampleRate:22050,sourceFrames:4,sourceChannels:1,sourceSHA256:'source'},buffer={sampleRate:22050,length:4,numberOfChannels:1,getChannelData:()=>new Float32Array(4)};let requests=0,decodes=0,finish;
const loader=createNativeSoundLoader({fetchAudio:async()=>{requests++;return {ok:true,arrayBuffer:async()=>new ArrayBuffer(2)}},createContext:()=>({decodeAudioData:()=>{decodes++;return new Promise(resolve=>{finish=resolve})}})});
const cancelled=new AbortController(),first=loader.load('sound.mp3',metadata,{signal:cancelled.signal}),second=loader.load('sound.mp3',metadata);const rejection=assert.rejects(first,error=>error.name==='AbortError');cancelled.abort();await rejection;await Promise.resolve();finish(buffer);assert.equal(await second,buffer);assert.equal(requests,1);assert.equal(decodes,1);assert.equal(await loader.load('sound.mp3',metadata),buffer);
await assert.rejects(loader.load('unused.mp3',metadata,{signal:cancelled.signal}),error=>error.name==='AbortError');assert.equal(requests,1);await assert.rejects(loader.load('bad.mp3',{}),/metadata/);assert.equal(requests,1);
let attempts=0;const retry=createNativeSoundLoader({fetchAudio:async()=>({ok:++attempts>1,status:503,arrayBuffer:async()=>new ArrayBuffer(2)}),createContext:()=>({decodeAudioData:async()=>buffer})});await assert.rejects(retry.load('sound.mp3',metadata),/HTTP 503/);assert.equal(retry.size(),0);assert.equal(await retry.load('sound.mp3',metadata),buffer);assert.equal(attempts,2);
const mismatch=createNativeSoundLoader({fetchAudio:async()=>({ok:true,arrayBuffer:async()=>new ArrayBuffer(2)}),createContext:()=>({decodeAudioData:async()=>({...buffer,length:5})})});await assert.rejects(mismatch.load('sound.mp3',metadata),/frame count/);assert.equal(mismatch.size(),0);
await assert.rejects(retry.load('native.flac',{...metadata,nativeSHA256:'incorrect'}),/checksum/);
console.log('Native sound loader shares verified decoding, cancels consumers without poisoning shared loads, retries failures and rejects metadata/hash mismatches; controller wiring pending');
