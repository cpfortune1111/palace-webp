import assert from 'node:assert/strict';
import {reversalHitPause} from '../Engine/reversal-hit-pause.js';

assert.deepEqual(reversalHitPause('4,7'),{source:5,target:8});
assert.deepEqual(reversalHitPause('4,7',{mugenMajor:0}),{source:4,target:7});
assert.deepEqual(reversalHitPause('4,7',{mugenMajor:0,ikemen:true}),{source:5,target:8});
assert.deepEqual(reversalHitPause('0,0'),{source:1,target:1});
assert.deepEqual(reversalHitPause('4,7',{groundType:0}),{source:null,target:8});
assert.deepEqual(reversalHitPause('4,7',{targetAirborne:true,airType:0}),{source:null,target:8});
assert.deepEqual(reversalHitPause('4,7',{sourceGettingHit:true,targetGettingHit:true}),{source:null,target:null});
assert.throws(()=>reversalHitPause('1,2,3'),/pausetime/);
assert.throws(()=>reversalHitPause('invalid,2'),/pausetime/);
assert.throws(()=>reversalHitPause('1,'),/pausetime/);
console.log('Successful reversal hitpause respects native version adjustment, existing-gethit suppression, None type asymmetry and minimum one frame');
