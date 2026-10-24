import assert from 'node:assert/strict';
import {applySoundPanController} from '../Engine/sound-pan-controller.js';

const caller={id:1},recipient={id:2},reads=[],writes=[],api={evaluate:value=>{reads.push(value);return value},findActor:id=>id===2?recipient:null,setPan:(...args)=>writes.push(args)};
assert.equal(applySoundPanController({type:'Other'},caller,api),false);
assert.throws(()=>applySoundPanController({type:'SndPan',params:{}},caller,api),/Missing SndPan channel/);
applySoundPanController({type:'SndPan',params:{channel:0}},caller,api);assert.deepEqual(writes.pop(),[caller,0,{pan:0,absolute:false}]);
reads.length=0;applySoundPanController({type:'SndPan',params:{redirectid:2,channel:-2,pan:40,abspan:80}},caller,api);assert.deepEqual(reads,[2,-2,40,80]);assert.deepEqual(writes.pop(),[recipient,-2,{pan:80,absolute:true}]);
reads.length=0;applySoundPanController({type:'SndPan',params:{redirectid:'2',channel:1,pan:90}},caller,api);assert.deepEqual(reads,['2']);assert.equal(writes.length,0);
applySoundPanController({type:'SndPan',params:{channel:'7',pan:'99'}},caller,api);assert.deepEqual(writes.pop(),[caller,0,{pan:0,absolute:false}]);
applySoundPanController({type:'SndPan',params:{channel:4294967295,abspan:.1}},caller,api);assert.deepEqual(writes.pop(),[caller,-1,{pan:Math.fround(.1),absolute:true}]);
assert.throws(()=>applySoundPanController({type:'SndPan',params:{channel:0,unknown:1}},caller,api),/Unsupported SndPan parameter/);
console.log('Independent SndPan recipient/required channel, typed extraction and pan-before-abspan evaluation pass; full controller parity remains pending');
