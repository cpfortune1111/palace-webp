import assert from 'node:assert/strict';
import {createSpecialRuntime} from '../Char/Venus/venus-special-runtime.js';
import {applyTransformSprite} from '../Engine/transform-sprite.js';

for(const compatibility of ['mugen','ikemen'])for(const player of [1,2])for(const facing of [-1,1]){
 let tick=0,enabled=true;
 const controller={type:'TransformSprite',params:{window:'1,2,3,4',xshear:'0.5'}};
 const root={player,state:0,x:0,y:0,facing,vars:[],moveType:'I'};
 const runtime=createSpecialRuntime({
  root:()=>root,context:()=>({query:()=>0}),commands:()=>({}),eval:Number,pair:value=>String(value).split(','),effects:[],tick:()=>tick,
  data:()=>({compatibility,helperStates:{1:{type:'S',physics:'N',moveType:'I',anim:0,controllers:[controller]}},lifecycleHelpers:{}}),
  trigger:()=>enabled,controller:(source,binding,context,adapter)=>applyTransformSprite(source,adapter.owner,{evaluate:Number,findActor:()=>null,split:value=>String(value).split(','),localScale:()=>1,window:actor=>actor.window??=Array(4).fill(0),setShear:(actor,value)=>actor.xshear=value}),
  advance:()=>{},frames:()=>[{time:1}],duration:()=>1000,collision:()=>({contact:false}),attack:()=>null,background:()=>{}
 });
 runtime.dispatch({type:'Helper',params:{id:'1',stateno:'1'}},null,null,{},root,player);
 const helper=runtime.entities[0];
 tick=1;runtime.step();assert.deepEqual(helper.window,[1,2,3,4]);assert.equal(helper.xshear,.5);
 enabled=false;tick=2;runtime.step();assert.deepEqual(helper.window,[0,0,0,0]);assert.equal(helper.xshear,0);
 helper.window=[5,6,7,8];helper.hitPause=2;tick=3;runtime.step();assert.deepEqual(helper.window,[0,0,0,0]);assert.equal(helper.hitPause,1);
 helper.window=[9,10,11,12];helper.xshear=.75;runtime.pauses.normal[0]={remaining:10,movetime:0,player:1,created:3};
 tick=4;runtime.step();assert.deepEqual(helper.window,[9,10,11,12]);assert.equal(helper.hitPause,1);assert.equal(helper.xshear,.75);
 runtime.pauses.normal.fill(null);helper.hitPause=0;tick=5;runtime.step();assert.deepEqual(helper.window,[0,0,0,0]);assert.equal(helper.xshear,0);
}
console.log('Actual Helper TransformSprite windows reset each active preparation, including local hitpause, retain during global pause and clear after unpausing');
