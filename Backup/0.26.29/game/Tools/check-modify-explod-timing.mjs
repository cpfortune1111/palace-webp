import assert from 'node:assert/strict';
import {applyModifiedRemovalTime,modifiedExplodExpired,applyModifiedPauseTimes,modifiedExplodSystemPaused} from '../Engine/modify-explod-timing.js';

const effect={age:5};applyModifiedRemovalTime(effect,3,false);assert.equal(effect.removetime,3);assert.ok(modifiedExplodExpired(effect,27));
applyModifiedRemovalTime(effect,3,true);assert.equal(effect.removetime,8);assert.equal(modifiedExplodExpired(effect,27),false);effect.age=8;assert.ok(modifiedExplodExpired(effect,27));
applyModifiedRemovalTime(effect,0,true);assert.ok(modifiedExplodExpired(effect,27));
applyModifiedRemovalTime(effect,-1,true);effect.age=500;assert.equal(modifiedExplodExpired(effect,27),false);
applyModifiedRemovalTime(effect,-2,true);assert.ok(modifiedExplodExpired(effect,27));assert.equal(modifiedExplodExpired(effect,Infinity),false);
effect.age=2147483647;applyModifiedRemovalTime(effect,1,true);assert.equal(effect.removetime,-2147483648);
console.log('ModifyExplod removal uses native absolute/MUGEN versus relative/Ikemen deadlines, zero/negative modes and signed overflow');
effect.age=5;applyModifiedPauseTimes(effect,{supermovetime:3,pausemovetime:4},false);assert.deepEqual([effect.supermovetime,effect.pausemovetime],[3,4]);
applyModifiedPauseTimes(effect,{supermovetime:3,pausemovetime:4},true);assert.deepEqual([effect.supermovetime,effect.pausemovetime],[8,9]);
const pauses={normal:[{remaining:10,created:0},null],super:[null,null]};assert.equal(modifiedExplodSystemPaused(effect,pauses,1),false);effect.age=9;assert.equal(modifiedExplodSystemPaused(effect,pauses,1),true);
pauses.super[0]={remaining:10,created:0};effect.supermovetime=-1;assert.equal(modifiedExplodSystemPaused(effect,pauses,1),false);effect.supermovetime=-2;assert.equal(modifiedExplodSystemPaused(effect,pauses,1),false);effect.supermovetime=-3;assert.equal(modifiedExplodSystemPaused(effect,pauses,1),true);
assert.equal(modifiedExplodSystemPaused(effect,pauses,0),false);
