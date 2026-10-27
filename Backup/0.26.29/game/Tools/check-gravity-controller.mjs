import assert from 'node:assert/strict';
import {applyGravityController} from '../Engine/gravity-controller.js';

const caller={vy:2,acceleration:1.25,ownScale:1,stateScale:1},helper={vy:2,acceleration:3.75,ownScale:4,stateScale:2};
const api={evaluate:expression=>expression,findActor:id=>id===7?helper:null,ownScale:actor=>actor.ownScale,stateScale:actor=>actor.stateScale,acceleration:actor=>actor.acceleration,velocity:actor=>actor.vy,setVelocity:(actor,value)=>{actor.vy=value}};
assert.equal(applyGravityController({type:'Null'},caller,api),false);
assert.equal(applyGravityController({type:'Gravity'},caller,api),true);assert.equal(caller.vy,3.25);
applyGravityController({type:'Gravity',params:{redirectid:7}},caller,api);assert.equal(helper.vy,9.5);assert.equal(caller.vy,3.25);
for(const operand of ['7',undefined,NaN]){
 const ids=[];
 applyGravityController({type:'Gravity',params:{redirectid:'operand'}},caller,{...api,evaluate:()=>operand,findActor:id=>{ids.push(id);return null},acceleration:()=>{throw Error('Invalid recipient must not sample acceleration')}});
 assert.deepEqual(ids,[0]);
}
helper.vy=.1;helper.acceleration=.2;helper.ownScale=.25;helper.stateScale=.75;
applyGravityController({type:'Gravity',params:{redirectid:4294967303}},caller,api);
assert.equal(helper.vy,Math.fround(Math.fround(.1)+Math.fround(Math.fround(.2)*Math.fround(Math.fround(.25)/Math.fround(.75)))));
assert.throws(()=>applyGravityController({type:'Gravity',params:{value:1}},caller,api),/Unsupported Gravity parameter/);
applyGravityController({type:'Gravity',params:{ignorehitpause:1,persistent:0}},caller,api);
console.log('Gravity uses recipient-owned acceleration, float32 state-coordinate ratio, signed redirect extraction and missing-recipient early return');
