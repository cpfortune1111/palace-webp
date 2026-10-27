import assert from 'node:assert/strict';
import {decodeNativePcmWave} from '../Engine/native-pcm-wave.js';

const context={createBuffer(channels,length,sampleRate){const data=Array.from({length:channels},()=>new Float32Array(length));return {numberOfChannels:channels,length,sampleRate,getChannelData:channel=>data[channel]}}};
function wave(bits,channels){
 const width=bits/8,frames=3,bytes=new ArrayBuffer(44+frames*channels*width),view=new DataView(bytes),word=(offset,value)=>{for(let index=0;index<value.length;index++)view.setUint8(offset+index,value.charCodeAt(index))};
 word(0,'RIFF');view.setUint32(4,bytes.byteLength-8,true);word(8,'WAVE');word(12,'fmt ');view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,channels,true);view.setUint32(24,22050,true);view.setUint32(28,22050*channels*width,true);view.setUint16(32,channels*width,true);view.setUint16(34,bits,true);word(36,'data');view.setUint32(40,frames*channels*width,true);
 for(let frame=0;frame<frames;frame++)for(let channel=0;channel<channels;channel++){
  const offset=44+(frame*channels+channel)*width,value=bits===8?[0,128,255][frame]:[-(2**(bits-1)),0,2**(bits-1)-1][frame];
  if(bits===8)view.setUint8(offset,value);else if(bits===16)view.setInt16(offset,value,true);else if(bits===32)view.setInt32(offset,value,true);else for(let index=0;index<3;index++)view.setUint8(offset+index,value>>(index*8)&255);
 }
 return bytes;
}
for(const bits of [8,16,24,32])for(const channels of [1,2]){
 const buffer=decodeNativePcmWave(wave(bits,channels),context),denominator=bits===8?128:2**(bits-1),expected=[-1,0,Math.fround((denominator-1)/denominator)];
 assert.equal(buffer.sampleRate,22050);assert.equal(buffer.length,3);assert.equal(buffer.numberOfChannels,channels);for(let channel=0;channel<channels;channel++)assert.deepEqual([...buffer.getChannelData(channel)],expected);
}
assert.throws(()=>decodeNativePcmWave(new ArrayBuffer(3),context),/header/);assert.throws(()=>decodeNativePcmWave(wave(16,1).slice(0,-1),context),/Truncated/);const unsupported=wave(16,1);new DataView(unsupported).setUint16(20,3,true);assert.throws(()=>decodeNativePcmWave(unsupported,context),/Unsupported/);
console.log('Native PCM 8/16/24/32-bit mono/stereo normalization, frame metadata and malformed/unsupported boundaries pass; compressed codecs remain separate');
