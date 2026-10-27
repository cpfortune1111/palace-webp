import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {CommandInputBuffer} from '../Engine/command-input-buffer.js';
import {CommandMatcher} from '../Engine/command-matcher.js';
if(!process.argv[2])throw Error('Private native command receipt required');
const receipt=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
assert.equal(receipt.commit,'cb56d73badb322f3725257c2e8cfd157b2c3989d');
assert.equal(crypto.createHash('sha256').update(fs.readFileSync(receipt.executable)).digest('hex'),receipt.executableSha256);
const commands=['','a','/a','~3a','/3a','a+b','a|b','/a|b','D,a|b','D,DF,F,a','F,F','/F,/F','~B,F,a','D,>a','a,b','~U,D,a','L,R,a','/N','~$N','/B+a','~$UR','a|/b,D'];
let random=191;
const next=()=>{random=(Math.imul(random,1664525)+1013904223)>>>0;return random};
const cases=[];
for(const Command of commands)for(let variant=0;variant<8;variant++){
 const Frames=[];
 for(let i=0;i<90;i++)Frames.push({Held:['U','D','L','R','a','b','x'].filter(()=>next()%7<2),Facing:i<45?1:-1,AI:variant===6,Helper:variant===6,HitPause:i%11===0,PauseEnd:i%13===0,Extra:i%3});
 // Stable holds/releases and quarter circle exercise success as well as failure.
 for(const Held of [[],['D'],['D','R'],['R'],['R','a'],[],['a'],['a'],['a'],[],['L'],[],['L'],['a','b']])Frames.push({Held,Facing:1});
 cases.push({Command,Time:variant%3===0?0:15,StepTime:variant%2?3:15,Buffer:2,AutoGreater:variant%2===0,BufferHitPause:variant!==2,BufferPauseEnd:variant!==3,Frames});
}
const synthetic=cases.length;
if(process.argv[3]){
 const corpus=JSON.parse(fs.readFileSync(process.argv[3],'utf8'));assert.equal(corpus.commit,receipt.commit);
 for(const original of corpus.cases)cases.push({...original,AutoGreater:true,Frames:cases[5].Frames});
}
const result=spawnSync(receipt.executable,[],{input:JSON.stringify(cases),encoding:'utf8',maxBuffer:64*1024*1024,timeout:60000});
assert.equal(result.status,0,result.stderr);
const native=JSON.parse(result.stdout);assert.equal(native.length,cases.length);let ticks=0,completions=0,diagnostics=0;
for(const [index,request] of cases.entries()){
 const reference=native[index];assert.equal(reference.Panic,'');
 const options={time:request.Time,stepTime:request.StepTime,bufferTime:request.Buffer,autoGreater:request.AutoGreater,bufferHitPause:request.BufferHitPause,bufferPauseEnd:request.BufferPauseEnd};
 if(reference.Error){assert.throws(()=>new CommandMatcher(request.Command,options),error=>error instanceof SyntaxError&&error.message===reference.Error);diagnostics++;continue}
 const matcher=new CommandMatcher(request.Command,options);
 assert.deepEqual(matcher.steps,(reference.Steps??[]).map(step=>({keys:(step.Keys??[]).map(k=>({key:k.Key,hold:k.Hold,release:k.Release,fourway:k.Fourway,charge:k.Charge})),greater:step.Greater,orLogic:step.Or})),request.Command);
 assert.deepEqual(matcher.order,reference.Order,request.Command);
 const buffer=new CommandInputBuffer();
 for(const [frame,held] of request.Frames.entries()){
  buffer.updatePhysical(Object.fromEntries(held.Held.map(key=>[key,true])),held.Facing);
  matcher.step(buffer,{ai:held.AI,helper:held.Helper,hitPause:held.HitPause,pauseEnd:held.PauseEnd,extra:held.Extra});
  const expected=reference.Ticks[frame];
  assert.deepEqual({complete:matcher.complete,buffer:matcher.buffer,time:matcher.time,completed:matcher.completed,timers:matcher.timers},{complete:expected.Complete,buffer:expected.Buffer,time:expected.Time,completed:expected.Completed,timers:expected.Timers},`case ${index} ${request.Command} tick ${frame}`);
  ticks++;if(matcher.complete)completions++;
 }
}
assert.ok(completions>100);
console.log(`PASS ${synthetic} synthetic + ${cases.length-synthetic} original command scenarios / ${diagnostics} matching diagnostics / ${ticks} ticks / ${completions} completion observations against native Step`);
