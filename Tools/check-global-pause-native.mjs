import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {GlobalPauseState} from '../Engine/global-pause-state.js';
if(!process.argv[2])throw Error('Private native global-pause receipt required');
const receipt=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));assert.equal(receipt.commit,'cb56d73badb322f3725257c2e8cfd157b2c3989d');
assert.equal(crypto.createHash('sha256').update(fs.readFileSync(receipt.executable)).digest('hex'),receipt.executableSha256);
const Actors=[
 {ID:1,Player:0,StatePlayer:0,Team:1,OwnPal:true,Parent:0,Children:[11],Defence:1},
 {ID:2,Player:1,StatePlayer:1,Team:2,OwnPal:true,Parent:0,Children:[21],Defence:1},
 {ID:11,Player:0,StatePlayer:0,Team:1,OwnPal:false,Parent:1,Children:[12,13,999],Defence:1},
 {ID:12,Player:0,StatePlayer:0,Team:1,OwnPal:false,Parent:11,Children:[],Defence:1},
 {ID:13,Player:0,StatePlayer:0,Team:1,OwnPal:true,Parent:11,Children:[],Defence:1},
 {ID:21,Player:1,StatePlayer:0,Team:2,OwnPal:false,Parent:2,Children:[],Defence:1}];
const set=(Kind,Actor,Time,MoveTime,EndBuffer,Defence=1)=>({Kind,Actor,Time,MoveTime,EndBuffer,Defence,Unhittable:true,Background:true});
const prepare=()=>Actors.map(actor=>({Kind:'prepare',Actor:actor.ID}));
const scenarios=[{Actors,Operations:[set('pause',1,5,5,3),set('pause',2,2,1,2),set('pause',21,1,1,4),{Kind:'advance'},...prepare(),set('super',1,4,2,2,.5),set('super',2,1,1,1,.5),{Kind:'advance'},...prepare(),{Kind:'advance'},...prepare(),{Kind:'reset'},set('super',12,3,1,1,.9),{Kind:'advance'},...prepare()]}];
for(const slot of ['pause','super'])for(const time of [-2147483648,-2,-1,0,1,2,5,2147483647])for(const move of [-1,0,1,6])for(const window of [-1,0,1,7]){
 scenarios.push({Actors,Operations:[set(slot,1,time,move,window),set(slot,2,1,1,window),set(slot,21,2,move,window),{Kind:'advance'},...prepare(),set(slot,1,1,1,1),{Kind:'advance'},...prepare(),{Kind:'reset'}]});
}
let random=211;const next=()=>{random=(Math.imul(random,1664525)+1013904223)>>>0;return random>>>16};
for(let trial=0;trial<32;trial++){
 const Operations=[];
 for(let i=0;i<80;i++){
  const kind=next()%6,actor=Actors[next()%Actors.length].ID;
  if(kind<2)Operations.push({...set(kind?'super':'pause',actor,[-1,0,1,2,5,8][next()%6],[-1,0,1,3,8][next()%5],[-1,0,1,3,9][next()%5],[0,.5,.9,1,1.25][next()%5]),Background:next()%2===0,Unhittable:next()%2===0});
  else if(kind<4)Operations.push({Kind:'prepare',Actor:actor,NoCommands:next()%3===0,HitPause:next()%3===0});
  else Operations.push({Kind:kind===4?'advance':'reset'});
 }
 scenarios.push({Actors,Operations});
}
const run=spawnSync(receipt.executable,[],{input:JSON.stringify(scenarios),encoding:'utf8',maxBuffer:64*1024*1024,timeout:60000});assert.equal(run.status,0,run.stderr);
const native=JSON.parse(run.stdout);assert.equal(native.length,scenarios.length);let transitions=0;
for(const [index,scenario]of scenarios.entries()){
 const actors=scenario.Actors.map(a=>({id:a.ID,player:a.Player,statePlayer:a.StatePlayer,team:a.Team,ownPal:a.OwnPal,parent:a.Parent,children:[...a.Children],defenceMultiplier:Math.fround(a.Defence),pauseMoveTime:0,superMoveTime:0,previousPauseMoveTime:0,previousSuperMoveTime:0,unhittableTime:0,ignoreDarkenTime:0,paused:false,actionTemporary:0})),state=new GlobalPauseState(actors);
 assert.equal(native[index].length,scenario.Operations.length);
 for(const [step,op]of scenario.Operations.entries()){
  const actor=state.byId.get(op.Actor);
  if(op.Kind==='pause'||op.Kind==='super')state.set(op.Kind==='pause'?'normal':'super',actor,{time:op.Time,moveTime:op.MoveTime,endBuffer:op.EndBuffer,background:op.Background,unhittable:op.Unhittable,defenceMultiplier:op.Defence});
  else if(op.Kind==='advance')state.advanceTimers();
  else if(op.Kind==='prepare')state.prepare(actor,{hasCommandList:!op.NoCommands,hitPause:!!op.HitPause});
  else if(op.Kind==='reset')state.resetTimers();
  const timer=s=>({Time:s.time,Buffer:s.buffer,Player:s.player,EndBuffer:s.endBuffer,Background:s.background});
  const actual={Normal:timer(state.normal),Super:timer(state.super),Actors:actors.map(a=>({ID:a.id,PauseMove:a.pauseMoveTime,SuperMove:a.superMoveTime,PreviousPauseMove:a.previousPauseMoveTime,PreviousSuperMove:a.previousSuperMoveTime,Unhittable:a.unhittableTime,IgnoreDarken:a.ignoreDarkenTime,Defence:a.defenceMultiplier,Paused:a.paused,ActionTemporary:a.actionTemporary}))};
  const expected=native[index][step];for(const a of expected.Actors)a.Defence=Math.fround(a.Defence);
  assert.deepEqual(actual,expected,`scenario ${index} transition ${step} ${op.Kind}`);transitions++;
 }
}
console.log(`PASS ${scenarios.length} native global-pause scenarios / ${transitions} transitions: arbitration, next-frame timers, allowances, reset, defence stacking and darken-family propagation`);
