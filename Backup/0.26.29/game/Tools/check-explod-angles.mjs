import assert from 'node:assert/strict';
import {compileExplodAngles} from '../Engine/explod-angles.js';

const reads=[];
const state=compileExplodAngles({xangle:'horizontal',angle:'rotation',yangle:'vertical'},expression=>{reads.push(expression);return {rotation:90,horizontal:20,vertical:30}[expression]});
assert.deepEqual(reads,['rotation','vertical','horizontal']);
assert.deepEqual(state,{enabled:true,value:90,xangle:20,yangle:30,scale:[1,1],pivot:[0,0]});
assert.equal(compileExplodAngles({},()=>{throw Error('Unexpected evaluation')}).enabled,false);
for(const value of ['90',NaN,undefined])assert.equal(compileExplodAngles({angle:'operand'},()=>value).value,0);
assert.equal(compileExplodAngles({angle:'operand'},()=>.1).value,Math.fround(.1));
console.log('Explod angle/Y/X fields preserve pinned compiler order, float32 extraction and independent default geometry');
