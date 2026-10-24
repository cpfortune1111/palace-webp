import assert from 'node:assert/strict';
import {createSoundSampleLooper,soundRepeatCount} from '../Engine/sound-sample-looper.js';

function source(length=10){return {length,position:0,read(count){const samples=[];while(samples.length<count&&this.position<this.length)samples.push(this.position++);return {samples,ok:samples.length>0}},seek(position){this.position=position;return null},error:()=>null}}
assert.deepEqual([-3,0,1,2,5].map(soundRepeatCount),[-1,0,0,1,4]);
const once=createSoundSampleLooper(source(),{loopStart:2,loopEnd:6});assert.deepEqual(once.read(12),{samples:[0,1,2,3,4,5,6,7,8,9],ok:true});assert.deepEqual(once.read(1),{samples:[],ok:false});
const whole=createSoundSampleLooper(source(),{repeatCount:1,loopStart:2,loopEnd:6});assert.deepEqual(whole.read(12),{samples:[0,1,2,3,4,5,2,3,4,5],ok:false});
const split=createSoundSampleLooper(source(),{repeatCount:1,loopStart:2,loopEnd:6});assert.deepEqual(split.read(7),{samples:[0,1,2,3,4,5,2],ok:true});assert.equal(split.remaining(),0);assert.deepEqual(split.read(12),{samples:[3,4,5,6,7,8,9],ok:true});
const infinite=createSoundSampleLooper(source(),{repeatCount:-1,loopStart:2,loopEnd:6});assert.deepEqual(infinite.read(13),{samples:[0,1,2,3,4,5,2,3,4,5,2,3,4],ok:true});assert.equal(infinite.position(),5);
const normalized=createSoundSampleLooper(source(3),{repeatCount:1,loopStart:9,loopEnd:-1});assert.deepEqual(normalized.read(7),{samples:[0,1,2,0,1,2],ok:false});
const broken=source();broken.seek=()=>Error('Seek failed');const failed=createSoundSampleLooper(broken,{repeatCount:1,loopStart:2,loopEnd:6});assert.deepEqual(failed.read(7),{samples:[0,1,2,3,4,5],ok:true});assert.deepEqual(failed.read(1),{samples:[],ok:false});assert.equal(failed.error(),null);
assert.throws(()=>createSoundSampleLooper(source(0),{repeatCount:-1}).read(1),/empty/);
console.log('Source-frame looper preserves native repeat normalization, finite chunk-sensitive tail, infinite loops and seek-failure behavior; production playback remains pending');
