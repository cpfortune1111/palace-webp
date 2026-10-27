import assert from 'node:assert/strict';
import {createSoundResampler} from '../Engine/sound-resampler.js';
import {createSoundSampleLooper} from '../Engine/sound-sample-looper.js';

function source(length,shape=value=>value){return {length,position:0,read(count){const samples=[];while(samples.length<count&&this.position<length){const value=shape(this.position++);samples.push([value,-value])}return {samples,ok:samples.length>0}},seek(position){this.position=position;return null},error:()=>null}}
const slower=createSoundResampler(source(10),{ratio:.5,quality:1});assert.deepEqual(slower.read(25).samples.map(frame=>frame[0]),[0,.5,1,1.5,2,2.5,3,3.5,4,4.5,5,5.5,6,6.5,7,7.5,8,8.5,9,9]);assert.deepEqual(slower.read(1),{samples:[],ok:false});
const faster=createSoundResampler(source(10),{ratio:2});assert.deepEqual(faster.read(10).samples.map(frame=>frame[0]),[0,2,4,6,8]);
const polynomial=createSoundResampler(source(2000,value=>value**3),{ratio:1.25,quality:4}),rendered=polynomial.read(500).samples;
for(const [index,frame]of rendered.entries()){const expected=(index*1.25)**3;assert.ok(Math.abs(frame[0]-expected)<=Math.max(1,Math.abs(expected))*1e-12);assert.ok(Math.abs(frame[1]+expected)<=Math.max(1,Math.abs(expected))*1e-12)}
const dynamic=createSoundResampler(source(30),{ratio:1,quality:1});assert.deepEqual(dynamic.read(3).samples.map(frame=>frame[0]),[0,1,2]);dynamic.setRatio(2);assert.deepEqual(dynamic.read(3).samples.map(frame=>frame[0]),[3,5,7]);assert.equal(dynamic.ratio(),2);
const finite=()=>createSoundResampler(createSoundSampleLooper(source(10),{repeatCount:1,loopStart:2,loopEnd:6}),{ratio:1});const whole=finite().read(20).samples.map(frame=>frame[0]),split=finite(),parts=[...split.read(3).samples,...split.read(20).samples].map(frame=>frame[0]);assert.deepEqual(whole,[0,1,2,3,4,5,2,3,4,5]);assert.deepEqual(parts,whole);
const tail=createSoundResampler(createSoundSampleLooper(source(1000),{repeatCount:1,loopStart:100,loopEnd:600}),{ratio:1});assert.deepEqual(tail.read(2000).samples.map(frame=>frame[0]),[...Array.from({length:600},(_,index)=>index),...Array.from({length:900},(_,index)=>index+100)]);
assert.throws(()=>createSoundResampler(source(1),{ratio:0}),/ratio/);assert.throws(()=>createSoundResampler(source(1),{ratio:1,quality:65}),/quality/);assert.throws(()=>dynamic.setRatio(Infinity),/ratio/);
console.log('Pinned beep barycentric resampling uses 512-frame source reads, exact nodes, polynomial interpolation, phase-preserving ratio changes and native finite-loop tails; production wiring pending');
