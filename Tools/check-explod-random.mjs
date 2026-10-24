import assert from 'node:assert/strict';
import {sampleExplodRandom} from '../Engine/explod-random.js';

const order=[],api={evaluate:value=>{order.push(value);return Number(value)},split:value=>value.split(','),randomFloat:(low,high)=>{order.push([low,high]);return high},scale:.5};
assert.deepEqual(sampleExplodRandom(undefined,api),[0,0,0]);assert.deepEqual(order,[]);
assert.deepEqual(sampleExplodRandom('8,12,16',api),[2,3,4]);assert.deepEqual(order,['8',[-2,2],'12',[-3,3],'16',[-4,4]]);
order.length=0;assert.deepEqual(sampleExplodRandom('0',api),[0,0,0]);assert.deepEqual(order,['0',[-0,0]]);
assert.throws(()=>sampleExplodRandom('1,2,3,4',api),/Invalid/);
console.log('Explod random optional XYZ extraction, caller scale and interleaved expression/sample order pass');
