import assert from 'node:assert/strict';
import {createSpecialRuntime} from '../Char/Venus/venus-special-runtime.js';

let tick=0;
const counters=[0,0],controllers=[
 {type:'VarAdd',params:{value:'1',persistent:'2'},index:0},
 {type:'VarAdd',params:{value:'1',persistent:'0',ignorehitpause:'1'},index:1}
];
const root={player:1,state:0,x:0,y:0,facing:1,vars:[],moveType:'I'};
const runtime=createSpecialRuntime({
 root:player=>({...root,player}),context:()=>({query:()=>0}),commands:()=>({}),
 eval:Number,pair:value=>String(value).split(','),effects:[],tick:()=>tick,
 data:()=>({helperStates:{1:{type:'S',physics:'N',anim:0,controllers}},lifecycleHelpers:{}}),
 trigger:()=>true,controller:controller=>{counters[controller.index]++},
 advance:()=>{},frames:()=>[{time:1}],duration:()=>1000,
 collision:()=>({contact:false}),attack:()=>null,background:()=>{}
});
runtime.dispatch({type:'Helper',params:{id:'1',stateno:'1'}},null,null,{},root,1);
const helper=runtime.entities[0];
helper.hitPause=2;
tick=1;runtime.step();assert.deepEqual(counters,[0,1]);assert.equal(helper.time,0);
tick=2;runtime.step();assert.deepEqual(counters,[0,1]);assert.equal(helper.time,0);
for(tick=3;tick<=8;tick++)runtime.step();
assert.deepEqual(counters,[3,1]);
assert.equal(helper.time,6);
console.log('Helper runtime honors persistence and ignorehitpause without advancing paused animation');
