import assert from 'node:assert/strict';
import {createActorUnhittableTime} from '../Engine/actor-unhittable-time.js';

const timers=createActorUnhittableTime();
timers.set('root1',2,10);timers.set('helper1',3,10);
timers.prepare('root1',10);assert.equal(timers.remaining('root1'),2);
timers.prepare('root1',11);timers.prepare('root1',11);assert.equal(timers.remaining('root1'),1);
assert.equal(timers.remaining('helper1'),3);
timers.prepare('root1',12,{paused:true});assert.equal(timers.remaining('root1'),1);
timers.set('root1',-1,12);assert.equal(timers.remaining('root1'),1);
timers.prepare('root1',12);assert.equal(timers.remaining('root1'),0);
timers.set('helper1',0,12);assert.equal(timers.remaining('helper1'),0);
timers.clear();assert.equal(timers.remaining('helper1'),0);
console.log('Independent actor invulnerability timers: collision-pass writes, once-per-prepare decrement, pause, zero and negative semantics pass');
