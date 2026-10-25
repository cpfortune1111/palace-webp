import assert from 'node:assert/strict';
import {createSpecialRuntime} from '../Char/Venus/venus-special-runtime.js';
const owner={player:1,id:1,key:'root1',kind:'root',facing:1,x:0,y:0,life:111,lifeMax:2345,vars:[],maps:new Map()},observed=[],warnings=[];
const data={character:'fixture',powerMaximum:1000,helperStates:{0:{type:'S',physics:'N',moveType:'I',controllers:[]}}};
const runtime=createSpecialRuntime({root:()=>owner,data:()=>data,commands:()=>({}),context:()=>({player:1}),eval:value=>Number(value),pair:value=>String(value).split(','),tick:()=>0,initializeStateJuggle:actor=>observed.push([actor.id,actor.anim,actor.ctrl,actor.life,actor.lifeMax,actor.vx,actor.vy,actor.vz])});
const warn=console.warn;console.warn=value=>warnings.push(value);
try{runtime.dispatch({type:'Helper',params:{id:'-7'}},null,null,{},owner,1)}finally{console.warn=warn}
assert.deepEqual(observed,[[0,0,1,2345,2345,0,0,0]]);assert.equal(warnings.length,1);assert.equal(runtime.entities[0].state,0);
console.log('Helper native bootstrap and negative-ID normalization are visible before target StateDef entry hooks');
