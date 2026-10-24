import assert from 'node:assert/strict';
import {createNativeSoundStream} from '../Engine/native-sound-stream.js';

const samples=Float32Array.from({length:8},(_,index)=>index/16),buffer={sampleRate:22050,length:8,numberOfChannels:1,getChannelData:()=>samples},metadata={sourceSampleRate:22050,sourceFrames:8,sourceChannels:1};
const read=params=>createNativeSoundStream(buffer,metadata,{quality:1,...params},22050).read(128).samples.map(frame=>frame[0]);
assert.deepEqual(read({}),[0,1,2,3,4,5,6,7].map(value=>value/16));assert.deepEqual(read({freqMul:2}),[0,2,4,6].map(value=>value/16));assert.equal(read({freqMul:.5}).length,16);
assert.deepEqual(read({startPosition:3}),[3,4,5,6,7].map(value=>value/16));assert.deepEqual(read({startPosition:99}),read({}));
assert.deepEqual(read({loopCount:2,loopStart:2,loopEnd:6}),[0,1,2,3,4,5,2,3,4,5].map(value=>value/16));assert.deepEqual(read({loopCount:2,loopStart:2,loopEnd:6,freqMul:2}),[0,2,4,2,4].map(value=>value/16));
assert.equal(createNativeSoundStream(buffer,metadata,{loopCount:-1},22050).read(300).samples.length,300);assert.throws(()=>createNativeSoundStream(buffer,metadata,{},0),/output rate/);
console.log('Native stream composes source-frame seek/loops, float32 frequency target-rate conversion and pinned resampling; real-time controller integration remains pending');
