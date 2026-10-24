import assert from 'node:assert/strict';
import {applyModifySoundController} from '../Engine/modify-sound-controller.js';

const caller={id:1},target={id:2},reads=[],writes=[];
const api={evaluate:value=>{reads.push(value);return value},findActor:id=>id===2?target:null,ownVolume:actor=>{assert.equal(actor,target);return 384},modify:(...args)=>writes.push(args)};
assert.equal(applyModifySoundController({type:'Other'},caller,api),false);
applyModifySoundController({type:'ModifySnd',params:{redirectid:2,channel:7,pan:10,abspan:20,volume:128,volumescale:50,priority:3,stopongethit:1,stoponchangestate:0}},caller,api);
assert.deepEqual(reads,[2,7,10,20,128,50,3,1,0]);assert.deepEqual(writes,[[target,7,{pan:{pan:20,absolute:true},volume:192,priority:3,hit:true,state:false}]]);
reads.length=0;writes.length=0;applyModifySoundController({type:'ModifySnd',params:{}},caller,api);assert.deepEqual(reads,[]);assert.deepEqual(writes,[[caller,-1,{}]]);
reads.length=0;writes.length=0;applyModifySoundController({type:'ModifySnd',params:{redirectid:99,volume:128}},caller,api);assert.deepEqual(reads,[99]);assert.deepEqual(writes,[]);
applyModifySoundController({type:'ModifySnd',params:{freqmul:2}},caller,api);assert.equal(writes.at(-1)[2].freqMul,2);
applyModifySoundController({type:'ModifySnd',params:{position:4294967297}},caller,api);assert.equal(writes.at(-1)[2].position,4294967297);
applyModifySoundController({type:'ModifySnd',params:{loopstart:4294967297,loopend:4294967300,loop:1,loopcount:3}},caller,api);assert.deepEqual(writes.at(-1)[2],{loopStart:4294967297,loopEnd:4294967300,repeatCount:2});
assert.throws(()=>applyModifySoundController({type:'ModifySnd',params:{unknown:2}},caller,api),/Unsupported ModifySnd parameter/);
console.log('ModifySnd parameter extraction preserves recipient selection, ordered evaluation, wide positions, loop count precedence and absent-field retention; full consumers remain under verification');
