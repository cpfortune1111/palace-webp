import assert from 'node:assert/strict';
import {reversalHitPause} from '../Engine/reversal-hit-pause.js';

assert.deepEqual(reversalHitPause('4,7'),{source:5,target:8});
assert.deepEqual(reversalHitPause('4,7',{mugenMajor:0}),{source:4,target:7});
assert.deepEqual(reversalHitPause('4,7',{mugenMajor:0,ikemen:true}),{source:5,target:8});
assert.deepEqual(reversalHitPause('0,0'),{source:1,target:1});
assert.deepEqual(reversalHitPause('2147483647,2147483647'),{source:1,target:1});
assert.deepEqual(reversalHitPause('2147483647,2147483647',{mugenMajor:0}),{source:2147483647,target:2147483647});
for(const first of [-2147483648,-1,0,1,2147483646,2147483647])for(const second of [-2147483648,0,2147483647])for(const fix of [false,true]){
 const expected=value=>Number(BigInt.asIntN(32,BigInt(value)+BigInt(fix)))>1?Number(BigInt.asIntN(32,BigInt(value)+BigInt(fix))):1;
 assert.deepEqual(reversalHitPause(first+','+second,{mugenMajor:fix?1:0}),{source:expected(first),target:expected(second)});
}
assert.deepEqual(reversalHitPause('4,7',{groundType:0}),{source:null,target:8});
assert.deepEqual(reversalHitPause('4,7',{targetAirborne:true,airType:0}),{source:null,target:8});
assert.deepEqual(reversalHitPause('4,7',{sourceGettingHit:true,targetGettingHit:true}),{source:null,target:null});
assert.throws(()=>reversalHitPause('1,2,3'),/pausetime/);
assert.throws(()=>reversalHitPause('invalid,2'),/pausetime/);
assert.throws(()=>reversalHitPause('1,'),/pausetime/);
console.log('Successful reversal hitpause respects native version adjustment, existing-gethit suppression, None type asymmetry and minimum one frame');
