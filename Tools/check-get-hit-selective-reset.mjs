import assert from 'node:assert/strict';
import {selectiveGetHitReset} from '../Engine/get-hit-selective-reset.js';
const result=selectiveGetHitReset({xoff:3,damage:7,guardpoints:4,'fall.envshake.time':8,playerno:1});
assert.equal(result.xoff,3);assert.equal(result.damage,7);assert.equal(result.guardpoints,4);assert.equal(result['fall.envshake.time'],0);assert.equal(result.playerno,-2);assert.equal(result['fall.yvel'],-18);
assert.ok(Number.isNaN(result['stand.friction']));assert.equal(selectiveGetHitReset({}, {localCoord:1280,gameWidth:640})['fall.yvel'],-36);
assert.equal(selectiveGetHitReset({}, {legacyFall:true})['fall.yvel'],-4.5);
console.log('Pinned selective GetHit reset preserves stacked fields/offsets, clears fall shake and restores native local defaults');
