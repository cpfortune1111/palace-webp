import assert from 'node:assert/strict';
import {controllerFloat32,controllerBoolean} from '../Engine/controller-value-conversion.js';
import {applyDefenseController,createDefenseState} from '../Engine/defense-controllers.js';
import {applyAttackController,createAttackState} from '../Engine/attack-controllers.js';
import {applyAngleController,createAngleState} from '../Engine/angle-controllers.js';
import {applyAttackDistanceController} from '../Engine/attack-distance.js';
import {applyVelocityController} from '../Engine/velocity-controllers.js';
import {applyPositionController} from '../Engine/position-controllers.js';

for(const value of [NaN,undefined,'3','Moon','']){
 assert.equal(controllerFloat32(value),0);
 assert.equal(controllerBoolean(value),false);
 const actor={angleState:createAngleState(),attackState:createAttackState(),defenseState:createDefenseState(),hitDef:{guardDistance:{x:[10,20],y:[30,40],z:[50,60]}}};
 const api={compatibility:'ikemen',evaluate:()=>value,findActor:()=>null,split:expression=>[expression],splitPair:expression=>[expression]};
 applyAngleController({type:'AngleSet',params:{value:'operand'}},actor,api);
 applyAttackController({type:'AttackMulSet',params:{value:'operand'}},actor,api);
 applyDefenseController({type:'DefenceMulSet',params:{value:'operand',onhit:'operand'}},actor,api);
 applyAttackDistanceController({type:'AttackDist',params:{width:'operand'}},actor,api);
 assert.equal(actor.angleState.value,0);
 assert.deepEqual(Object.values(actor.attackState),[0,0,0,0]);
 assert.deepEqual(actor.defenseState,{customDefense:0,onHit:false});
 assert.deepEqual(actor.hitDef.guardDistance.x,[0,20]);
}
for(const value of [1,-2,Infinity,-Infinity,true])assert.equal(controllerBoolean(value),true);
for(const value of [0,-0,false])assert.equal(controllerBoolean(value),false);
assert.equal(controllerFloat32(1.2),Math.fround(1.2));
assert.ok(Object.is(controllerFloat32(-0),-0));
assert.equal(controllerFloat32(Infinity),Infinity);
for(const value of [NaN,'3','Moon']){
 const actor={x:5,y:6,z:7,vx:8,vy:9,vz:10,facing:1,groundLevel:20,platformY:3,getHit:{xvel:100}};
 const api={evaluate:()=>value,findActor:()=>null,cameraX:10};
 applyVelocityController({type:'HitVelSet',params:{x:'operand'}},actor,api);
 assert.equal(actor.vx,8);
 for(const type of ['VelAdd','VelMul','VelSet']){
  applyVelocityController({type,params:{x:'operand',y:'operand',z:'operand'}},actor,api);
  assert.deepEqual([actor.vx,actor.vy,actor.vz],type==='VelAdd'?[8,9,10]:[0,0,0]);
 }
 applyPositionController({type:'PosAdd',params:{x:'operand',y:'operand',z:'operand'}},actor,api);
 assert.deepEqual([actor.x,actor.y,actor.z],[5,6,7]);
 applyPositionController({type:'PosSet',params:{x:'operand',y:'operand',z:'operand'}},actor,api);
 assert.deepEqual([actor.x,actor.y,actor.z],[10,23,0]);
}
console.log('Controller float/bool extraction maps undefined and strings to zero/false at real angle/attack/defense/distance consumers without changing expression evaluation');
