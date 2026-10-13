import assert from 'node:assert/strict';
import {compositeOpaqueTransPixels} from '../Engine/trans-compositor.js';

const destination=new Uint8ClampedArray([100,100,100,255,40,50,60,255]);
const source=new Uint8ClampedArray([60,30,90,255,200,200,200,0]);
assert.deepEqual([...compositeOpaqueTransPixels(destination,source,{type:'add',alpha:[255,255]})],[160,130,190,255,40,50,60,255]);
assert.deepEqual([...compositeOpaqueTransPixels(destination,source,{type:'sub',alpha:[255,255]})],[40,70,10,255,40,50,60,255]);
assert.deepEqual([...destination],[100,100,100,255,40,50,60,255]);
assert.throws(()=>compositeOpaqueTransPixels(new Uint8ClampedArray(8),source,{type:'add',alpha:[255,255]}),/opaque/);
assert.throws(()=>compositeOpaqueTransPixels(destination,source,{type:'subadd',alpha:[255,255]}),/grayscale/);
assert.deepEqual([...compositeOpaqueTransPixels(destination,source,{type:'subadd',alpha:[255,255]},{graySource:new Uint8ClampedArray([60,60,60,255,0,0,0,0])})],[100,70,130,255,40,50,60,255]);
console.log('Opaque Trans RGBA composition preserves clear pixels and requires explicit grayscale pass');