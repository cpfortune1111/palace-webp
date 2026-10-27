import assert from 'node:assert/strict';
import {hitAttackDepth} from '../Engine/hit-attack-depth.js';

assert.deepEqual(hitAttackDepth({}),[4,4]);
assert.deepEqual(hitAttackDepth({},{constants:{'size.attack.depth.x':3,'size.attack.depth.y':7}}),[3,7]);
assert.deepEqual(hitAttackDepth({'attack.depth':'6'}),[6,6]);
const reads=[];
assert.deepEqual(hitAttackDepth({'attack.depth':'front,back'},{evaluate:value=>{reads.push(value);return value==='front'?2:9}}),[2,9]);
assert.deepEqual(reads,['front','back']);
assert.throws(()=>hitAttackDepth({'attack.depth':'1,2,3'}),/component count/);
console.log('Native attack depth defaults, float32 pair compilation and single-component duplication passed');
