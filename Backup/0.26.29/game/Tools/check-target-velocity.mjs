import assert from 'node:assert/strict';
import {createTargetList} from '../Engine/target-list.js';
import {applyTargetVelocityController} from '../Engine/target-velocity.js';

const targets=createTargetList();targets.add(1);targets.add(2);
const owner={localScale:1,targets},actors=new Map([[1,{localScale:2,getHit:{hitid:7},vx:0,vy:3}],[2,{localScale:4,getHit:{hitid:7},vx:0,vy:5}]]);
const api={evaluate:Number,findActor:id=>id===99?owner:actors.get(id),targets:actor=>actor.targets,scale:actor=>actor.localScale,velocity:(actor,axis)=>actor['v'+axis],setVelocity:(actor,axis,value)=>{actor['v'+axis]=value}};
applyTargetVelocityController({type:'TargetVelSet',params:{x:8,id:7}},owner,api);
assert.deepEqual([actors.get(1).vx,actors.get(2).vx],[4,1]);
assert.deepEqual([actors.get(1).vy,actors.get(2).vy],[3,5]);
applyTargetVelocityController({type:'TargetVelAdd',params:{y:-4,id:7,index:1}},owner,api);
assert.equal(actors.get(2).vy,4);assert.equal(actors.get(1).vy,3);
assert.equal(actors.get(2).vx,1);
applyTargetVelocityController({type:'TargetVelSet',params:{id:7,index:1}},owner,api);
assert.deepEqual([actors.get(2).vx,actors.get(2).vy],[1,4]);
actors.get(2).vz=6;applyTargetVelocityController({type:'TargetVelAdd',params:{id:7,index:1,z:8}},owner,api);
assert.equal(actors.get(2).vz,8);
const caller={localScale:2};applyTargetVelocityController({type:'TargetVelSet',params:{redirectid:99,x:8,id:7,index:0}},caller,api);
assert.equal(actors.get(1).vx,8);
const expressions=[];
applyTargetVelocityController({type:'TargetVelSet',params:{redirectid:'var(8)',id:7,index:0,x:'var(9)'}},caller,{...api,evaluate:value=>{expressions.push(value);return value==='var(8)'?99:value==='var(9)'?2.5:Number(value)}});
assert.equal(actors.get(1).vx,2.5);assert.deepEqual(expressions,['var(8)',7,0,'var(9)']);
let axesEvaluated=false;applyTargetVelocityController({type:'TargetVelSet',params:{redirectid:999,x:'missing'}},caller,{...api,evaluate:value=>{if(value==='missing')axesEvaluated=true;return Number(value)}});
assert.equal(axesEvaluated,false);
console.log('TargetVelSet/Add axis omission, caller redirection, index and pinned cumulative scale behavior passed');
for(const operand of [NaN,'3','Moon']){
 const invalidApi={...api,evaluate:expression=>expression==='operand'?operand:Number(expression)};
 actors.get(1).vx=12;
 applyTargetVelocityController({type:'TargetVelAdd',params:{id:7,index:0,x:'operand'}},owner,invalidApi);
 assert.equal(actors.get(1).vx,12);
 applyTargetVelocityController({type:'TargetVelSet',params:{id:7,index:0,x:'operand'}},owner,invalidApi);
 assert.equal(actors.get(1).vx,0);
}
