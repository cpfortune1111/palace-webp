import {decodeNativePcmWave} from './native-pcm-wave.js';
import {createDecodedSoundFrames} from './decoded-sound-frames.js';

function cancelled(){return new DOMException('Native sound load cancelled','AbortError')}

async function waitForSound(promise,signal){
 if(!signal)return promise;if(signal.aborted)throw cancelled();
 let abort;
 try{return await Promise.race([promise,new Promise((resolve,reject)=>{abort=()=>reject(cancelled());signal.addEventListener('abort',abort,{once:true})})])}
 finally{signal.removeEventListener('abort',abort)}
}

export function createNativeSoundLoader({fetchAudio=globalThis.fetch,createContext=metadata=>new OfflineAudioContext(metadata.sourceChannels,1,metadata.sourceSampleRate)}={}){
 const cache=new Map();
 return {
  async load(url,metadata,{signal}={}){
   if(signal?.aborted)throw cancelled();
   if(!metadata||!Number.isInteger(metadata.sourceSampleRate)||metadata.sourceSampleRate<=0||!Number.isInteger(metadata.sourceFrames)||metadata.sourceFrames<0||![1,2].includes(metadata.sourceChannels))throw Error('Missing native sound sample metadata');
   const key=JSON.stringify([url,metadata.sourceSampleRate,metadata.sourceFrames,metadata.sourceChannels,metadata.sourceSHA256,metadata.nativeSHA256]);
   let pending=cache.get(key);
   if(!pending){
    pending=(async()=>{
     const response=await fetchAudio(url);if(!response.ok)throw Error('Native sound HTTP '+response.status);const bytes=await response.arrayBuffer();
     if(metadata.nativeSHA256){const digest=await crypto.subtle.digest('SHA-256',bytes),actual=[...new Uint8Array(digest)].map(value=>value.toString(16).padStart(2,'0')).join('');if(actual!==metadata.nativeSHA256)throw Error('Native sound checksum mismatch')}
     const context=createContext(metadata),wave=bytes.byteLength>=12&&String.fromCharCode(...new Uint8Array(bytes,0,4))==='RIFF',buffer=wave?decodeNativePcmWave(bytes,context):await context.decodeAudioData(bytes);
     createDecodedSoundFrames(buffer,metadata);return buffer;
    })();cache.set(key,pending);pending.catch(()=>{if(cache.get(key)===pending)cache.delete(key)});
   }
   return waitForSound(pending,signal);
  },
  size:()=>cache.size
 };
}
