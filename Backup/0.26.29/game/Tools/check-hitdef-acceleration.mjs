import assert from 'node:assert/strict';
import {hitDefAcceleration} from '../Engine/hitdef-acceleration.js';
assert.deepEqual(hitDefAcceleration({}),{xaccel:-0,yaccel:Math.fround(1.4),zaccel:0});
assert.deepEqual(hitDefAcceleration({},{localCoord:320}),{xaccel:-0,yaccel:Math.fround(0.35),zaccel:0});
assert.deepEqual(hitDefAcceleration({xaccel:2,yaccel:3,zaccel:4},{recipientRatio:0.5,hitFacing:-1}),{xaccel:1,yaccel:1.5,zaccel:2});
assert.deepEqual(hitDefAcceleration({xaccel:2,zaccel:-3},{hitFacing:1}),{xaccel:-2,yaccel:Math.fround(1.4),zaccel:-3});
let count=0;assert.equal(hitDefAcceleration({zaccel:'caller'},{evaluate:expression=>{count++;return expression==='caller'?7:0}}).zaccel,7);assert.equal(count,1);
console.log('Native HitDef XYZ acceleration defaults, origin scale, source evaluation and recipient/facing conversion passed');
