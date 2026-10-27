import assert from 'node:assert/strict';
import {hitUnhittableTime} from '../Engine/hit-unhittable-time.js';

assert.deepEqual(hitUnhittableTime({}),[-1,-1]);
assert.deepEqual(hitUnhittableTime({},{pause:[4,9],reversal:true}),[-1,5]);
assert.deepEqual(hitUnhittableTime({unhittabletime:'7'},{pause:[4,9],reversal:true}),[7,5]);
assert.deepEqual(hitUnhittableTime({unhittabletime:'-2147483648,8'},{pause:[4,9],reversal:true}),[-1,5]);
assert.deepEqual(hitUnhittableTime({unhittabletime:'7,8'},{pause:[4,9],reversal:true,throwAttribute:true}),[7,8]);
assert.deepEqual(hitUnhittableTime({unhittabletime:'7'},{pause:[4,9],throwAttribute:true}),[5,5]);
assert.deepEqual(hitUnhittableTime({},{pause:[2147483647,0],reversal:true}),[-1,-1]);
let evaluations=0;
assert.deepEqual(hitUnhittableTime({unhittabletime:'2.9,3.8'},{evaluate:value=>{evaluations++;return Number(value)}}),[2,3]);
assert.equal(evaluations,2);
assert.throws(()=>hitUnhittableTime({unhittabletime:'1,2,3'}),/component count/);
console.log('Pinned unhittabletime missing-component finalization, reversal/throw overwrite order and int32 overflow pass; live timer consumption remains pending');
