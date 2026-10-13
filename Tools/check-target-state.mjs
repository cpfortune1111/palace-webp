import assert from 'node:assert/strict';
import {createTargetList} from '../Engine/target-list.js';
import {applyTargetStateController} from '../Engine/target-state.js';

const targets=createTargetList();targets.add(2);targets.add(3);
const owner={targets,stateOwner:'venus'},caller={stateOwner:'moon'},actors=new Map([[1,owner],[2,{ctrl:true,getHit:{hitid:7}}],[3,{ctrl:true,getHit:{hitid:8}}]]),changes=[];
const api={evaluate:value=>value==='var(8)'?800:Number(value),findActor:id=>actors.get(id),targets:actor=>actor.targets,stateOwner:actor=>actor.stateOwner,setControl:(actor,value)=>{actor.ctrl=value},changeState:(actor,state,stateOwner)=>changes.push({actor,state,stateOwner})};
applyTargetStateController({type:'TargetState',params:{redirectid:1,id:7,index:0,value:'var(8)'}},caller,api);
assert.equal(changes.length,1);assert.equal(changes[0].actor,actors.get(2));assert.equal(changes[0].state,800);assert.equal(changes[0].stateOwner,'venus');assert.equal(actors.get(2).ctrl,false);assert.equal(actors.get(3).ctrl,true);
applyTargetStateController({type:'TargetState',params:{redirectid:1,value:-1}},caller,api);assert.equal(changes.length,1);
applyTargetStateController({type:'TargetState',params:{redirectid:1,index:9,value:0}},caller,api);assert.equal(changes.length,1);
applyTargetStateController({type:'TargetState',controllerStateNo:-2,params:{redirectid:1,id:8,value:0}},caller,{...api,stateOwner:(actor,source)=>source.controllerStateNo===-2?'own-character':actor.stateOwner});
assert.equal(changes.length,2);assert.equal(changes[1].stateOwner,'own-character');assert.equal(changes[1].state,0);assert.equal(actors.get(3).ctrl,false);
console.log('TargetState caller values, redirected state owner, ID/index selection and control removal passed');