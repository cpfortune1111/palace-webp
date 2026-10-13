import assert from 'node:assert/strict';
import {applyOffsetController,offsetDrawingPosition} from '../Engine/offset-controller.js';

const caller={scale:2,offset:[1,2]},target={scale:4,offset:[10,20]},evaluated=[];
const api={evaluate:value=>{evaluated.push(value);return Number(value)},findActor:id=>id===7?target:null,localScale:actor=>actor.scale,set:(actor,axis,value)=>actor.offset[axis]=value};
assert.equal(applyOffsetController({type:'Offset',params:{redirectid:'7.9',x:'3'}},caller,api),true);
assert.deepEqual(evaluated,['7.9','3']);
assert.deepEqual(target.offset,[6,20]);
assert.deepEqual(offsetDrawingPosition([100,200],target.offset,target.scale),[101.5,205]);
assert.deepEqual(caller.offset,[1,2]);
applyOffsetController({type:'Offset',params:{y:'-5'}},caller,api);
assert.deepEqual(caller.offset,[1,-10]);
applyOffsetController({type:'Offset',params:{}},caller,api);
assert.deepEqual(caller.offset,[1,-10]);
evaluated.length=0;
applyOffsetController({type:'Offset',params:{redirectid:'8',x:'9'}},caller,api);
assert.deepEqual(evaluated,['8']);
console.log('Offset caller-scale, redirect, omitted-axis retention and missing-target evaluation passed');