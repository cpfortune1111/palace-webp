import assert from 'node:assert/strict';
import {createSpecialRuntime} from '../Char/Venus/venus-special-runtime.js';
const root={kind:'root',player:1,id:1,key:'root1',x:0,y:0,facing:1,lifeMax:1000,maps:new Map()},data={character:'fixture',powerMaximum:1000,helperStates:{0:{type:'S',physics:'N',moveType:'I',ctrl:'1',controllers:[]}}};
for(const [value,expected] of [[0,false],[1,true],[-2,true],[false,false],[true,true],['1',false],[NaN,false],[undefined,false]]){
 let reads=0;const runtime=createSpecialRuntime({root:()=>root,data:()=>data,commands:()=>({}),context:()=>({player:1}),eval:expression=>{if(expression==='flag'){reads++;return value}return Number(expression)},pair:expression=>String(expression).split(','),tick:()=>0});
 runtime.dispatch({type:'Helper',params:{standby:'flag'}},root,null,{},root,1);assert.equal(runtime.entities[0].standby,expected);assert.equal(reads,1);assert.equal(runtime.entities[0].ctrl,1);
}
console.log('Helper standby consumes one typed caller-context boolean without overwriting raw control state');
