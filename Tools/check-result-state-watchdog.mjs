import assert from 'node:assert/strict';
import {createResultStateWatchdog} from '../Engine/result-state-watchdog.js';
import fs from 'node:fs';
import vm from 'node:vm';
const guard=createResultStateWatchdog();
for(let frame=0;frame<3000;frame++)assert.equal(guard.step(1,{state:240,anim:240,frame}),false);
guard.reset();
for(const frame of [0,1,2,0,1,2])assert.equal(guard.step(1,{state:240,anim:240,frame}),false);
assert.equal(guard.step(1,{state:240,anim:240,frame:0}),true);
assert.equal(guard.step(1,{state:0,anim:0,frame:0}),false);
assert.equal(guard.step(2,{state:240,anim:240,frame:0}),false);
guard.reset();for(let tick=0;tick<1200;tick++)assert.equal(guard.step(1,{state:240,anim:240,frame:0,infinite:true}),false);
assert.equal(guard.step(1,{state:240,anim:240,frame:0,infinite:true}),true);
console.log('Result states: long animations preserved, two-loop rescue and independent players passed');
const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const body=html.slice(html.indexOf('function stepRoundResultFighter('),html.indexOf('function stepLifecycleGlobals('));
for(const player of [1,2]){
 const context={p1Reaction:null,p2:{state:240,anim:240,elem:1,y:-1,vy:2,vx:0,life:1000,moveType:'A',time:0},state:240,current:240,fi:0,posX:0,posY:-1,vx:0,vy:2,stateTicks:0,runtimeCtrl:0,sourceState:()=>({controllers:[]}),constVal:()=>1,advanceAirOneTick:()=>{},advanceFighterAirOneTick:()=>{},framesFor:()=>[{time:10000}],resultStateWatchdog:createResultStateWatchdog(),enterIRState:()=>{throw Error('Premature S0')},enterP2State:()=>{throw Error('Premature P2 S0')}};
 vm.createContext(context);vm.runInContext(body,context);context.stepRoundResultFighter(player);assert.equal(player===1?context.posY:context.p2.y,0);assert.equal(player===1?context.state:context.p2.state,240);
}
let callback;const targets=[];const button={addEventListener:(event,handler)=>callback=handler,blur:()=>{}};
const target={value:'p1'},document={createElement:()=>({}),querySelector:selector=>selector==='#inputPanel'?{appendChild:()=>{}}:selector==='#killPlayer'?button:target};
const context={document,gameShell:{isHome:()=>false},roundFlow:{canFight:()=>true},p1Life:1000,p2:{life:1000},enforceKoM1:()=>targets.push('ko'),resetPlayerInput:()=>{}};vm.createContext(context);
vm.runInContext(html.slice(html.indexOf('const killControls='),html.indexOf('function enforceKoM1(')),context);
for(const choice of ['p1','p2','all','random']){context.p1Life=context.p2.life=1000;target.value=choice;callback();if(choice==='p1'||choice==='all')assert.equal(context.p1Life,0);if(choice==='p2'||choice==='all')assert.equal(context.p2.life,0);if(choice==='random')assert.equal([context.p1Life,context.p2.life].filter(life=>life===0).length,1)}
assert.equal(targets.length,4);console.log('Result integration: landing preserves both states; KILL P1/P2/ALL/RANDOM passed');

