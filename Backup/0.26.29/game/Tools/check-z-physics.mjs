import assert from 'node:assert/strict';
import {stepZPhysics} from '../Engine/z-physics.js';
assert.deepEqual(stepZPhysics(10,6),{position:16,velocity:6});
assert.deepEqual(stepZPhysics(10,6,{physics:'S',standFriction:0.5}),{position:16,velocity:0});
assert.deepEqual(stepZPhysics(10,6,{physics:'C',crouchFriction:0.5}),{position:16,velocity:3});
assert.deepEqual(stepZPhysics(10,6,{physics:'S',standFriction:0.5,frozen:true}),{position:10,velocity:0});
assert.deepEqual(stepZPhysics(10,6,{bound:true}),{position:10,velocity:6});
assert.deepEqual(stepZPhysics(10,-2,{physics:'A'}),{position:8,velocity:-2});
console.log('Z velocity integration, post-move stand/crouch friction, stand-only threshold and frozen/bound axis policy passed');
