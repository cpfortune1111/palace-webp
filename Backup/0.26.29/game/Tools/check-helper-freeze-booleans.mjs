import assert from 'node:assert/strict';
import {createSpecialRuntime} from '../Char/Venus/venus-special-runtime.js';
import {applyPosFreezeController} from '../Engine/pos-freeze.js';

for(const compatibility of ['mugen','ikemen'])for(const player of [1,2])for(const facing of [1,-1]){
 let tick=0,operand=1;
 const controller={type:'PosFreeze',params:{value:'operand'}};
 const root={player,state:0,x:10,y:-50,facing,vars:[],moveType:'I'};
 const evaluate=expression=>expression==='operand'?operand:Number(expression);
 const runtime=createSpecialRuntime({
  root:()=>root,context:()=>({query:()=>0}),commands:()=>({}),eval:evaluate,pair:value=>String(value).split(','),effects:[],tick:()=>tick,
  data:()=>({compatibility,helperStates:{1:{type:'A',physics:'N',moveType:'I',anim:0,controllers:[controller]}},lifecycleHelpers:{}}),
  trigger:()=>true,controller:(source,binding,context,adapter)=>applyPosFreezeController(source,adapter.owner,{evaluate,set:(owner,value)=>{owner.positionFrozen=value}}),
  advance:()=>{},frames:()=>[{time:1}],duration:()=>1000,collision:()=>({contact:false}),attack:()=>null,background:()=>{}
 });
 runtime.dispatch({type:'Helper',params:{id:'1',stateno:'1'}},null,null,{},root,player);
 const helper=runtime.entities[0];
 helper.x=10;helper.y=-50;helper.z=5;helper.vx=3*facing;helper.vy=2;helper.vz=4;
 tick=1;runtime.step();
 assert.deepEqual([helper.x,helper.y,helper.z,helper.positionFrozen],[10,-50,5,true]);
 operand='1';tick=2;runtime.step();
 assert.deepEqual([helper.x,helper.y,helper.z,helper.positionFrozen],[10+3*facing,-48,9,false]);
 operand=NaN;tick=3;runtime.step();
 assert.deepEqual([helper.x,helper.y,helper.z,helper.positionFrozen],[10+6*facing,-46,13,false]);
 controller.params={};tick=4;runtime.step();
 assert.deepEqual([helper.x,helper.y,helper.z,helper.positionFrozen],[10+6*facing,-46,13,true]);
 assert.deepEqual([helper.vx,helper.vy,helper.vz],[3*facing,2,4]);
}
console.log('Real Helper CNS/physics preserves numeric/default PosFreeze but moves XYZ for runtime string/NaN across profiles, player slots and facings');
