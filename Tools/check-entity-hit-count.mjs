import assert from 'node:assert/strict';
import {createSpecialRuntime} from '../Char/Venus/venus-special-runtime.js';

for(const kind of ['helper','projectile'])for(const guarded of [false,true]){
 let tick=0;
 const root={player:1,state:0,x:0,y:0,facing:1,vars:[],moveType:'I'};
 const params={attr:'S,SP',damage:'0,0',numhits:'var(8)'};
 const runtime=createSpecialRuntime({root:player=>({...root,player}),context:()=>({query:()=>0}),commands:()=>({}),eval:value=>value==='var(8)'?3:Number(value),pair:value=>String(value).split(','),effects:[],tick:()=>tick,
  data:()=>({helperStates:{1:{type:'S',physics:'N',moveType:'A',anim:0,controllers:[{type:'HitDef',params}]}},lifecycleHelpers:{}}),trigger:()=>true,controller:()=>{},advance:()=>{},frames:()=>[{time:1}],duration:()=>1000,collision:()=>({contact:true}),hit:()=>({guarded,attackerPause:0}),attack:()=>null,background:()=>{}});
 runtime.dispatch({type:kind==='helper'?'Helper':'Projectile',params:kind==='helper'?{id:'1',stateno:'1'}:{...params,projid:'1',projanim:'0'}},null,null,{},root,1);
 const entity=runtime.entities[0];tick=1;runtime.step();
 assert.deepEqual(runtime.numeric({forcestand:'0.5',forcecrouch:'-0.5'},{}),{forcestand:1,forcecrouch:1});
 assert.equal(entity.hitCount,guarded?0:3);
 assert.equal(entity.guardCount,guarded?3:0);
 assert.equal(runtime.context(entity).query('guardcount'),guarded?3:0);
 assert.equal(entity.moveGuarded,guarded?1:0);
}
console.log('Actual helper/projectile runtime contact writers honor evaluated numhits and guard exclusion');
