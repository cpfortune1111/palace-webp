import assert from 'node:assert/strict';
import {activateExplodBinding,resetLegacyExplodBinding,modifyExplodBindingPosition,applyExplodBindingParameters,finalizeExplodBindingPosition,stepExplodBinding} from '../Engine/explod-binding.js';
import {applyModifyExplodController} from '../Engine/modify-explod.js';
import {commitModifyExplodEffects} from '../Engine/modify-explod-commit.js';

const make=()=>({x:105,y:10,z:0,bindOffset:[5,0,0],facing:1,vx:2,vy:0,vz:0,accel:[1,0,0],age:5,bindtime:0,screen:false});
const effect=make();activateExplodBinding(effect,1);applyExplodBindingParameters(effect,1,{bindid:2,bindtime:2},false);const trace=[];
for(const position of [[200,0,0],[210,0,0],[999,0,0],[999,0,0]]){stepExplodBinding(effect,position);trace.push([effect.x,effect.vx,effect.bindtime])}
assert.deepEqual(trace,[[205,3,1],[215,4,0],[218,5,0],[222,6,0]]);assert.equal(effect.nativeBinding.targetId,2);
const versioned=make();activateExplodBinding(versioned,1);applyExplodBindingParameters(versioned,1,{bindtime:2},true);assert.equal(versioned.bindtime,7);for(let tick=0;tick<7;tick++)stepExplodBinding(versioned,[tick,0,0]);assert.equal(versioned.bindtime,0);
applyExplodBindingParameters(versioned,1,{bindid:-1,bindtime:2147483647},true);assert.equal(versioned.nativeBinding.targetId,1);assert.equal(versioned.bindtime,-2147483644);
const missing=make();activateExplodBinding(missing,1);applyExplodBindingParameters(missing,1,{bindid:999,bindtime:2},false);stepExplodBinding(missing,null);stepExplodBinding(missing,null);assert.equal(missing.x,105);stepExplodBinding(missing,null);assert.equal(missing.x,108);
const negative=make();negative.facing=-1;negative.x=95;negative.vx=-2;activateExplodBinding(negative,1);assert.deepEqual(negative.nativeBinding.relative,[-5,0,0]);assert.equal(negative.accel[0],-1);applyExplodBindingParameters(negative,1,{bindtime:-2},false);stepExplodBinding(negative,[200,0,0]);assert.equal(negative.x,195);assert.equal(negative.bindtime,-2);assert.equal(negative.facing,-1);
modifyExplodBindingPosition(negative,{position:[7],spread:[1,2,3]},2);assert.deepEqual(negative.nativeBinding.relative,[16,4,6]);finalizeExplodBindingPosition(negative,{id:7,position:[30,40,50],facing:-1});assert.deepEqual(negative.nativeBinding.relative,[-16,4,6]);assert.equal(negative.nativeBinding.targetId,7);
resetLegacyExplodBinding(negative);assert.deepEqual(negative.nativeBinding.position,[0,0,0]);assert.deepEqual(negative.nativeBinding.relative,[0,0,0]);assert.equal(negative.nativeBinding.targetId,-2);
const screen=make();screen.screen=true;activateExplodBinding(screen,1);applyExplodBindingParameters(screen,1,{bindtime:-1},false);stepExplodBinding(screen,[999,999,999]);stepExplodBinding(screen,[999,999,999]);assert.equal(screen.x,107);
const reset=make();activateExplodBinding(reset,1);stepExplodBinding(reset,null);stepExplodBinding(reset,null);const previous=reset.nativeBinding.position[0];applyExplodBindingParameters(reset,1,{bindtime:0},false);stepExplodBinding(reset,null);assert.equal(reset.nativeBinding.position[0],previous);
const order=[],writes=[];applyModifyExplodController({type:'ModifyExplod',params:{bindid:'2',bindtime:'3',removetime:'4'}},{},{evaluate:value=>{order.push(value);return Number(value)},split:value=>value.split(','),select:()=>[{}],ikemenVersion:()=>false,localScale:()=>1,modify:(effect,owner,changes)=>writes.push(changes)});assert.deepEqual(order,['2','3','4']);assert.deepEqual(writes[0].binding,{bindid:2,bindtime:3});
const phases=[];commitModifyExplodEffects([{},{}],{}, {},{modify:(effect,owner,changes,phase)=>phases.push(phase),finalize:()=>phases.push('finalize')});assert.deepEqual(phases,['beforeWindow','beforeWindow','afterWindow','afterWindow','finalize','finalize']);
console.log('Explod binding preserves native anchor/relative positions, finite countdown, versioned assignment, signed overflow, queued release velocity, missing targets, fixed facing and final postype ordering');
