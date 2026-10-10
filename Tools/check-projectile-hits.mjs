import assert from 'node:assert/strict';
import {createSpecialRuntime} from '../Char/Venus/venus-special-runtime.js';

for(const guarded of [false,true]){
 let tick=0,hits=0;
 const fighters=[null,{player:1,x:0,y:0,facing:1,vars:[]},{player:2,x:0,y:0,facing:-1,vars:[]}];
 const runtime=createSpecialRuntime({
  root:player=>fighters[player],tick:()=>tick,data:()=>({}),commands:()=>[],effects:[],
  context:()=>({query:()=>0}),pair:value=>String(value).split(','),eval:value=>Number(value),
  collision:()=>({contact:true,overlap:true}),hit:()=>{hits++;return {guarded,attackerPause:0}},
  camera:()=>0,advance:()=>{},duration:()=>100,attack:()=>null,background:()=>{}
 });
 runtime.dispatch({type:'Projectile',params:{projid:'1150',projanim:'9044',projhitanim:'-1',projhits:'3',projmisstime:'2',attr:'S, SP'}},null,null,null,fighters[1],1);
 tick=1;runtime.step();assert.equal(hits,1);
 tick=2;assert.equal(runtime.projectileEvent(1,1150,guarded?'guarded':'hit'),true);runtime.step();assert.equal(hits,1);
 tick=3;runtime.step();assert.equal(hits,2);
 tick=4;runtime.step();assert.equal(hits,2);
 tick=5;runtime.step();assert.equal(hits,3);assert.equal(runtime.entities.length,0);
}
console.log('Projectile multiple-hit and guard events passed');
