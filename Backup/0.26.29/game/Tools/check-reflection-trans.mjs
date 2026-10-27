import assert from 'node:assert/strict';
import {reflectionTransState} from '../Engine/reflection-trans.js';

assert.deepEqual(reflectionTransState(null,128),{type:'add',alpha:[128,127]});
assert.deepEqual(reflectionTransState({type:'none',alpha:[255,0]},255),{type:'add',alpha:[255,0]});
assert.deepEqual(reflectionTransState({type:'sub',alpha:[128,64]},128),{type:'sub',alpha:[64,160]});
assert.deepEqual(reflectionTransState({type:'subadd',alpha:[255,255]},128),{type:'add',alpha:[128,255]});
assert.deepEqual(reflectionTransState({type:'default',alpha:[255,0]},128,{type:'sub',alpha:[255,255]}),{type:'sub',alpha:[128,255]});
console.log('Reflection native intensity interpolation and Sub preservation passed');