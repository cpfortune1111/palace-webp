import assert from 'node:assert/strict';
import {palFxPixels} from '../Engine/palfx-pixels.js';
import {samplePalFx} from '../Engine/palfx-runtime.js';

const identity=samplePalFx(null),source=[60,30,90,255];
const close=(actual,expected)=>actual.forEach((value,index)=>assert.ok(Math.abs(value-expected[index])<0.0001));
close(palFxPixels(source,identity),source);
close(palFxPixels(source,{...identity,color:0}),[60,60,60,255]);
close(palFxPixels(source,{...identity,invertall:true}),[195,225,165,255]);
close(palFxPixels([60,30,90,128],{...identity,add:[255,0,0]}),[188,30,90,128]);
close(palFxPixels([255,0,0,255],{...identity,hue:1/3}),[0,255,0,255]);
close(palFxPixels(source,{...identity,mul:[256,0,512],allowNegative:true},{mode:'sub'}),[60,45,45,255]);
close(palFxPixels(source,{...identity,add:[30,0,0],mul:[256,128,384]},{forceGray:true}),[70,70,70,255]);
console.log('PalFX shader-order hue, inversion, grayscale, alpha-scaled add and Sub multipliers passed');