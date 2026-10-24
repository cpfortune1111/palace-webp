import assert from 'node:assert/strict';
import {createDecodedSoundFrames} from '../Engine/decoded-sound-frames.js';
import {createSoundSampleLooper} from '../Engine/sound-sample-looper.js';

const left=Float32Array.from([.1,.2,.3,.4]),right=Float32Array.from([-.1,-.2,-.3,-.4]),metadata={sourceSampleRate:22050,sourceFrames:4,sourceChannels:2},buffer={sampleRate:22050,length:4,numberOfChannels:2,getChannelData:channel=>channel===0?left:right};
const source=createDecodedSoundFrames(buffer,metadata);assert.deepEqual(source.read(2),{samples:[[left[0],right[0]],[left[1],right[1]]],ok:true});assert.equal(source.position,2);assert.ok(source.seek(-1) instanceof Error);assert.equal(source.position,2);assert.equal(source.seek(4),null);assert.deepEqual(source.read(1),{samples:[],ok:false});assert.equal(source.seek(0),null);
const loop=createSoundSampleLooper(source,{repeatCount:1,loopStart:1,loopEnd:3});assert.deepEqual(loop.read(6),{samples:[0,1,2,1,2].map(index=>[left[index],right[index]]),ok:false});
const mono=createDecodedSoundFrames({...buffer,numberOfChannels:1},{...metadata,sourceChannels:1});assert.deepEqual(mono.read(1).samples,[[left[0],left[0]]]);
assert.throws(()=>createDecodedSoundFrames(buffer,{}),/metadata/);assert.throws(()=>createDecodedSoundFrames(buffer,{...metadata,sourceSampleRate:44100}),/rate mismatch/);assert.throws(()=>createDecodedSoundFrames(buffer,{...metadata,sourceFrames:5}),/frame count/);assert.throws(()=>createDecodedSoundFrames(buffer,{...metadata,sourceChannels:1}),/channels/);
console.log('Decoded PCM frame source enforces native rate/frame/channel metadata, preserves stereo/mono samples, seek bounds and source-frame looping; production playback remains pending');
