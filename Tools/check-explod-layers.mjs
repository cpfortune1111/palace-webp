import assert from 'node:assert/strict';
import {applyExplodLayers} from '../Engine/explod-layers.js';

const inherited={sprpriority:7};
applyExplodLayers(inherited,{},-1,()=>{throw Error('Unexpected evaluation')});
assert.deepEqual(inherited,{sprpriority:7,layerno:-1});
const effect={sprpriority:7},events=[];
applyExplodLayers(effect,{layerno:'layer',under:'under',ontop:'top'},-1,expression=>{
 events.push([expression,effect.layerno,effect.sprpriority]);
 return {top:1,under:1,layer:-8}[expression];
});
assert.deepEqual(events,[['top',-1,7],['under',1,0],['layer',1,0]]);
assert.deepEqual(effect,{sprpriority:0,layerno:-1,ontop:true,under:true});
for(const value of ['1',undefined,NaN,0,false]){
 const target={sprpriority:9};
 applyExplodLayers(target,{ontop:'value',under:'value',layerno:'value'},1,()=>value);
 assert.deepEqual(target,{sprpriority:9,layerno:0,ontop:false,under:false});
}
for(const [value,expected] of [[-4,-1],[-.9,0],[.9,0],[4,1],[4294967295,-1]]){
 const target={};applyExplodLayers(target,{layerno:'value'},0,()=>value);assert.equal(target.layerno,expected);
}
console.log('Explod layer inheritance, ONTOP priority reset, ordered flags and clamped layer operands pass');
const synchronized={};
applyExplodLayers(synchronized,{synclayer:'-3',syncid:'-1'},0,Number,1034);
assert.deepEqual(synchronized,{layerno:0,syncLayer:-3,syncId:1034});
const syncReads=[];
applyExplodLayers(synchronized,{synclayer:'layer',syncid:'id',ontop:'top'},0,expression=>{syncReads.push(expression);return 0},1);
assert.deepEqual(syncReads,['layer','id','top']);
