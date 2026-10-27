import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {CommandMatcher} from '../Engine/command-matcher.js';
import {CommandList} from '../Engine/command-list.js';
if(!process.argv[2])throw Error('Private native list oracle receipt required');
const receipt=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
assert.equal(receipt.listMode,true);assert.equal(receipt.commit,'cb56d73badb322f3725257c2e8cfd157b2c3989d');
assert.equal(crypto.createHash('sha256').update(fs.readFileSync(receipt.executable)).digest('hex'),receipt.executableSha256);
const cases=[];
let random=199;
const next=()=>{random=(Math.imul(random,1664525)+1013904223)>>>0;return random};
for(let variant=0;variant<32;variant++){
 const Commands=['D,a','a','D,b','/B+a','/a|b','/a+/b','F,F'].map((Command,i)=>({Name:['special','other','special','held','or','held','dash'][i],Shared:!!(variant&(1<<(i%3))),Legacy:!!(variant&8),Definition:{Command,Time:15,StepTime:variant&16?2:15,Buffer:3,AutoGreater:true,BufferHitPause:true,BufferPauseEnd:true}}));
 const Frames=[];
 for(let i=0;i<90;i++)Frames.push({Held:['D','L','R','a','b'].filter(()=>next()%5<2),Facing:i<45?1:-1,AI:variant===31,Helper:variant===31,HitPause:i%11===0,PauseEnd:i%13===0,Extra:i%3,Assertions:i%17===0?[{Name:'special',Time:i%2?-1:4},{Name:'missing',Time:3}]:[],ClearNames:i%19===0?['special']:[]});
 for(const Held of [['D'],['D','a'],[],['L','a'],['L','a'],[],['a','b'],[],['R'],[],['R']])Frames.push({Held,Facing:1});
 cases.push({Commands,Frames});
}
const result=spawnSync(receipt.executable,[],{input:JSON.stringify(cases),encoding:'utf8',maxBuffer:64*1024*1024,timeout:60000});
assert.equal(result.status,0,result.stderr);const native=JSON.parse(result.stdout);assert.equal(native.length,cases.length);let compared=0;
for(const [index,request] of cases.entries()){
 assert.equal(native[index].Error,'');assert.equal(native[index].Panic,'');
 const list=new CommandList();
 for(const entry of request.Commands){const d=entry.Definition,matcher=new CommandMatcher(d.Command,{time:d.Time,stepTime:d.StepTime,bufferTime:d.Buffer,autoGreater:d.AutoGreater,bufferHitPause:d.BufferHitPause,bufferPauseEnd:d.BufferPauseEnd});if(entry.Legacy)matcher.applyBackwardCompatibility();list.add(entry.Name,matcher,{shared:entry.Shared})}
 assert.equal(native[index].ListTicks.length,request.Frames.length);
 for(const [frame,f] of request.Frames.entries()){
  list.input.updatePhysical(Object.fromEntries(f.Held.map(key=>[key,true])),f.Facing);
  const assertions=(f.Assertions??[]).map(a=>list.assert(a.Name,a.Time));
  for(const name of f.ClearNames??[])list.clearName(name);
  list.step({ai:f.AI,helper:f.Helper,hitPause:f.HitPause,pauseEnd:f.PauseEnd,extra:f.Extra});
  const expected=native[index].ListTicks[frame];assert.deepEqual(assertions,expected.Assertions);
  const actual=list.commands.map(({name,matcher:m})=>({Name:name,Complete:m.complete,Buffer:m.buffer,Time:m.time,MaxBuffer:m.maxBuffer,Completed:m.completed,Timers:m.timers,Steps:m.steps.map(step=>({Greater:step.greater,Or:step.orLogic,Keys:step.keys.map(k=>({Key:k.key,Hold:k.hold,Release:k.release,Fourway:k.fourway,Charge:k.charge}))}))}));
  assert.deepEqual(actual,expected.Commands,`list ${index} tick ${frame}`);
  for(const name of list.groups.keys())assert.equal(list.active(name),expected.Active[name]);compared++;
 }
}
console.log(`PASS ${cases.length} native/Web command lists / ${compared} ticks, shared duplicates, legacy transforms and assertions`);
