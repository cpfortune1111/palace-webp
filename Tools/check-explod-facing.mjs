import assert from 'node:assert/strict';
import {explodVerticalFacing,explodDrawingAngle,explodTrueFacing} from '../Engine/explod-facing.js';

assert.equal(explodVerticalFacing(undefined,()=>{throw Error('Unexpected evaluation')}),1);
for(const [value,expected] of [[-2,-1],[-.9,1],[0,1],[3,1],['-1',1],[NaN,1],[undefined,1]])assert.equal(explodVerticalFacing('operand',()=>value),expected);
const angle={enabled:true,value:30,xangle:10,yangle:20};
for(const facing of [-1,1])for(const vfacing of [-1,1]){
 const actual=explodDrawingAngle(angle,facing,vfacing),sign=facing===vfacing?1:-1;
 assert.equal(actual.value,30*sign);assert.equal(actual.yangle,20*sign);assert.equal(actual.xangle,10);
}
assert.deepEqual(angle,{enabled:true,value:30,xangle:10,yangle:20});
assert.equal(explodDrawingAngle(null,-1,-1),null);
for(const base of [-1,1])for(const relative of [-1,1])assert.equal(explodTrueFacing(base,relative),base*relative);
assert.equal(explodTrueFacing(0,-1),-1);assert.equal(explodTrueFacing(-1,0),-1);
console.log('Explod VFACING preserves integer sign defaults and native odd-reflection angle correction without mutating stored rotation');
