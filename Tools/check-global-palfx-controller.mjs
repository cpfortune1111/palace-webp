import assert from 'node:assert/strict';
import {applyAllPalFxController,applyBgPalFxController,selectPalFxBackgrounds} from '../Engine/global-palfx-controller.js';

let result;
const evaluated=[];
const api={evaluate:value=>{evaluated.push(value);return Number(value)},set:value=>result=value};
assert.equal(applyAllPalFxController({type:'AllPalFX',params:{time:-1,color:128,invertblend:2,redirectid:999}},api),true);
assert.equal(result.invertblend,1);assert.equal(result.color,0.5);assert.equal(result.time,-1);
assert.deepEqual(evaluated,[-1,128,2]);
applyAllPalFxController({type:'AllPalFX',params:{invertblend:-1}},api);assert.equal(result.invertblend,0);
console.log('AllPalFX shared parameters, global destination and forced inversion range passed');
const backgrounds=[{id:7},{id:8},{id:7}];
assert.deepEqual(selectPalFxBackgrounds(backgrounds,7,1),[backgrounds[2]]);
assert.deepEqual(selectPalFxBackgrounds(backgrounds,-1,1),[backgrounds[1]]);
assert.deepEqual(selectPalFxBackgrounds(backgrounds,7,9),[]);
applyBgPalFxController({type:'BGPalFX',params:{time:3,invertblend:2}}, {...api,setGlobal:value=>result=value});assert.equal(result.invertblend,-3);
const selected=[];
applyBgPalFxController({type:'BGPalFX',params:{id:7,index:1,time:4}}, {...api,backgrounds:()=>backgrounds,setBackground:(background,value)=>selected.push([background,value.time,value.invertblend])});
assert.deepEqual(selected,[[backgrounds[2],4,-3]]);