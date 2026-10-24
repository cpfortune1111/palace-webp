import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createNativeSoundStream} from '../Engine/native-sound-stream.js';

let Processor;
const messages=[];
class TestProcessor{
 constructor(){this.port={onmessage:null,postMessage:message=>messages.push(message)}}
}
const source=fs.readFileSync(new URL('../Engine/sound-playback-worklet.js',import.meta.url),'utf8').replace(/^import .*;\r?\n/,'');
vm.runInNewContext(source,{AudioWorkletProcessor:TestProcessor,createNativeSoundStream,sampleRate:44100,registerProcessor:(name,implementation)=>{assert.equal(name,'palace-native-sound');Processor=implementation}});
const channels=[new Float32Array([.125,.25,.5,.75])],metadata={sourceSampleRate:44100,sourceFrames:4,sourceChannels:1};
const output=()=>[[new Float32Array(128),new Float32Array(128)]];
const looping=new Processor({processorOptions:{channels,metadata,params:{loopCount:-1}}}),first=output();
assert.equal(looping.process([],first),true);
for(let frame=0;frame<128;frame++)for(const samples of first[0])assert.equal(samples[frame],channels[0][frame%4]);
assert.equal(messages.length,0);
looping.port.onmessage({data:{type:'stop'}});
const stopped=output();
assert.equal(looping.process([],stopped),false);
assert.equal(looping.frames,128);
for(const samples of stopped[0])assert.ok(samples.every(value=>value===0));
assert.equal(messages.length,0);
const finite=new Processor({processorOptions:{channels,metadata,params:{loopCount:0}}}),last=output();
assert.equal(finite.process([],last),false);
assert.equal(messages.length,1);
assert.equal(messages[0].type,'ended');
assert.equal(messages[0].frames,4);
assert.equal(finite.process([],output()),false);
assert.equal(messages.length,1);
console.log('Production AudioWorklet stops an infinite stream before the next quantum, leaves silent output and emits finite completion only once');
