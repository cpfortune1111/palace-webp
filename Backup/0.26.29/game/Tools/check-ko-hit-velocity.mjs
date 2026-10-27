import assert from 'node:assert/strict';
import {applyKoHitVelocity} from '../Engine/ko-hit-velocity.js';
const profile={groundXMultiplier:1.5,groundAdd:[-4,-8],airAdd:[-4,-8],groundYMinimum:-12,airYMinimum:-6};
const ground={xvel:8,yvel:0};applyKoHitVelocity(ground,profile);
assert.deepEqual(ground,{xvel:16,yvel:-12,xveladd:8,yveladd:-12});
const air={xvel:8,yvel:-3};applyKoHitVelocity(air,profile,{aerial:true});assert.deepEqual(air,{xvel:12,yvel:-11,xveladd:4,yveladd:-8});
const lying={xvel:8,yvel:0};applyKoHitVelocity(lying,profile,{lying:true});assert.deepEqual(lying,{xvel:8,yvel:0,xveladd:0,yveladd:0});
const disabled={xvel:8,yvel:0};applyKoHitVelocity(disabled,profile,{disabled:true});assert.equal(disabled.xveladd,0);
console.log('Native KO velocity additions, ground multiplier, Y clamp and no-velocity/lying zero deltas passed');
