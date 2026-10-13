import assert from 'node:assert/strict';
import {compositeOpaqueTransPixels,compositeOpaqueTransLayers,grayscaleTransPixels} from '../Engine/trans-compositor.js';
import {blendPixel,transBlendPasses} from '../Engine/trans-blend.js';

const destination=new Uint8ClampedArray([100,100,100,255,40,50,60,255]);
const source=new Uint8ClampedArray([60,30,90,255,200,200,200,0]);
assert.deepEqual([...compositeOpaqueTransPixels(destination,source,{type:'add',alpha:[255,255]})],[160,130,190,255,40,50,60,255]);
assert.deepEqual([...compositeOpaqueTransPixels(destination,source,{type:'sub',alpha:[255,255]})],[40,70,10,255,40,50,60,255]);
assert.deepEqual([...destination],[100,100,100,255,40,50,60,255]);
assert.throws(()=>compositeOpaqueTransPixels(new Uint8ClampedArray(8),source,{type:'add',alpha:[255,255]}),/opaque/);
assert.throws(()=>compositeOpaqueTransPixels(destination,source,{type:'subadd',alpha:[255,255]}),/grayscale/);
assert.deepEqual([...compositeOpaqueTransPixels(destination,source,{type:'subadd',alpha:[255,255]},{graySource:new Uint8ClampedArray([60,60,60,255,0,0,0,0])})],[100,70,130,255,40,50,60,255]);
console.log('Opaque Trans RGBA composition preserves clear pixels and requires explicit grayscale pass');
const background=new Uint8ClampedArray([20,20,20,255]);
const bright={pixels:new Uint8ClampedArray([250,250,250,255]),state:{type:'add',alpha:[255,255]}};
const dark={pixels:new Uint8ClampedArray([100,100,100,255]),state:{type:'sub',alpha:[255,255]}};
assert.deepEqual([...compositeOpaqueTransLayers(background,[bright,dark])],[155,155,155,255]);
assert.deepEqual([...compositeOpaqueTransLayers(background,[dark,bright])],[250,250,250,255]);
assert.deepEqual([...compositeOpaqueTransLayers(background,[{...bright,hidden:true},dark])],[0,0,0,255]);
assert.deepEqual([...background],[20,20,20,255]);
console.log('Ordered native Trans layers preserve per-layer saturation and hidden-layer filtering');
assert.deepEqual([...grayscaleTransPixels(new Uint8ClampedArray([60,30,90,128]))],[60,60,60,128]);
assert.deepEqual([...compositeOpaqueTransPixels(destination,source,{type:'subadd',alpha:[255,255]},{graySource:grayscaleTransPixels(source)})],[100,70,130,255,40,50,60,255]);
for(const type of ['none','add','sub','subadd'])for(const sourceAlpha of [0,1,64,128,254,255])for(const coefficients of [[0,255],[255,0],[255,255],[128,64],[64,128]]){
 const state={type,alpha:coefficients},input=new Uint8ClampedArray([240,31,77,sourceAlpha]),background=new Uint8ClampedArray([11,210,100,255]),gray=grayscaleTransPixels(input);
 const expected=sourceAlpha===0?[11,210,100]:blendPixel([11,210,100],[...input],transBlendPasses(state),{graySource:[...gray]});
 const expectedBytes=new Uint8ClampedArray([...expected,255]);
 assert.deepEqual(compositeOpaqueTransPixels(background,input,state,{graySource:gray}),expectedBytes);
}
console.log('Optimized compositor matches reference RGB passes across mode/alpha boundary matrix');