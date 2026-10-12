import assert from 'node:assert/strict';
import {hitDefCount,getHitContactCounts} from '../Engine/hit-count.js';

assert.equal(hitDefCount({}),1);
assert.equal(hitDefCount({numhits:3}),3);
assert.equal(hitDefCount({numhits:0}),0);
assert.equal(hitDefCount({numhits:-2}),-2);
assert.equal(hitDefCount({numhits:2.9}),2);
assert.deepEqual(getHitContactCounts({moveType:'I'},false),{hitcount:1,guardcount:0});
assert.deepEqual(getHitContactCounts({moveType:'H',getHit:{hitcount:2,guardcount:0,guarded:false}},false),{hitcount:3,guardcount:0});
assert.deepEqual(getHitContactCounts({moveType:'H',getHit:{hitcount:4,guardcount:2,guarded:true}},false),{hitcount:1,guardcount:2});
assert.deepEqual(getHitContactCounts({moveType:'H',getHit:{hitcount:4,guardcount:2,guarded:true}},true),{hitcount:4,guardcount:3});
assert.deepEqual(getHitContactCounts({moveType:'I',getHit:{hitcount:4,guardcount:2}},true),{hitcount:4,guardcount:1});
console.log('HitDef numhits default and integer contact counts passed');
