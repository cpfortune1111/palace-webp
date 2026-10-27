import assert from 'node:assert/strict';
import {animationFirstLoopDuration} from '../Engine/animation-first-loop.js';

assert.equal(animationFirstLoopDuration([{time:3},{time:0},{time:4}]),7);
assert.equal(animationFirstLoopDuration([{time:-1}]),Infinity);
assert.equal(animationFirstLoopDuration([{time:2},{time:-1},{time:4}]),Infinity);
assert.equal(animationFirstLoopDuration([]),0);
console.log('First-loop duration preserves indefinite frames and zero-time elements instead of summing them as finite ticks');
