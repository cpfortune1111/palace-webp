import assert from 'node:assert/strict';
import {applyExplodLayers,synchronizeExplodPriorityFacing} from '../Engine/explod-layers.js';

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
const live={syncId:7,sprpriority:8,facing:1},actor={sprPriority:-4,facing:-1};
assert.equal(synchronizeExplodPriorityFacing(live,id=>id===7?actor:null),true);
assert.deepEqual(live,{syncId:7,sprpriority:-4,facing:-1});
actor.sprPriority=5;actor.facing=1;
synchronizeExplodPriorityFacing(live,()=>actor);assert.equal(live.sprpriority,5);assert.equal(live.facing,1);
live.syncParams=false;actor.sprPriority=12;
synchronizeExplodPriorityFacing(live,()=>actor);assert.equal(live.sprpriority,5);
assert.equal(synchronizeExplodPriorityFacing(live,()=>null),false);
assert.equal(synchronizeExplodPriorityFacing(live,()=>({kind:'projectile'})),false);
live.syncParams=true;
const alpha={type:'add',alpha:[128,64]},palette={enabled:true};
synchronizeExplodPriorityFacing(live,()=>actor,{trans:()=>alpha,palette:()=>palette});
assert.deepEqual(live.transState,alpha);assert.notEqual(live.transState,alpha);assert.notEqual(live.transState.alpha,alpha.alpha);
assert.equal(live.syncedPalFx,palette);
alpha.alpha[0]=10;palette.enabled=false;live.syncParams=false;
synchronizeExplodPriorityFacing(live,()=>actor,{trans:()=>null,palette:()=>null});
assert.equal(live.transState.alpha[0],128);assert.equal(live.syncedPalFx.enabled,false);
live.syncParams=true;synchronizeExplodPriorityFacing(live,()=>actor,{trans:()=>null});assert.equal(live.transState,null);
const transformation={scale:[3,1.5],angleState:{enabled:true,value:90,xangle:0,yangle:0,scale:[1,1],pivot:[0,0]}};
synchronizeExplodPriorityFacing(live,()=>actor,{transform:()=>transformation});
transformation.scale[0]=99;transformation.angleState.pivot[0]=20;
assert.deepEqual(live.scale,[3,1.5]);assert.deepEqual(live.angleState.pivot,[0,0]);
live.syncParams=false;const registrations=[];
synchronizeExplodPriorityFacing(live,()=>actor,{register:(target,id)=>registrations.push([target===actor,id])});
assert.deepEqual(registrations,[[true,7]]);
const orderedReads=[];
applyExplodLayers({}, {synclayer:'layer',syncparams:'parameters',syncid:'id',ontop:'top',under:'under',layerno:'pass'},0,expression=>{orderedReads.push(expression);return 0},1);
assert.deepEqual(orderedReads,['layer','parameters','id','top','under','pass']);
for(const [value,expected] of [[1,true],[-1,true],[0,false],[NaN,false],['1',false],[undefined,false]]){
 const effect={};applyExplodLayers(effect,{syncparams:'operand'},0,()=>value,1);assert.equal(effect.syncParams,expected);
}
const skipped=[];
assert.equal(synchronizeExplodPriorityFacing({syncId:999},()=>null,{trans:()=>skipped.push('trans'),palette:()=>skipped.push('palette'),transform:()=>skipped.push('transform'),register:()=>skipped.push('register')}),false);
assert.deepEqual(skipped,[]);
