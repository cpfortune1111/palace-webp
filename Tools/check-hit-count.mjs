import assert from 'node:assert/strict';
import {hitDefCount} from '../Engine/hit-count.js';

assert.equal(hitDefCount({}),1);
assert.equal(hitDefCount({numhits:3}),3);
assert.equal(hitDefCount({numhits:0}),0);
assert.equal(hitDefCount({numhits:-2}),-2);
assert.equal(hitDefCount({numhits:2.9}),2);
console.log('HitDef numhits default and integer contact counts passed');
