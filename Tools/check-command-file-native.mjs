import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {compileCommandFile} from '../Engine/command-file.js';
import {createBattleCommandList} from '../Engine/battle-command-list.js';
if(!process.argv[2])throw Error('Private native CMD-file oracle receipt required');
const receipt=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
assert.equal(receipt.fileMode,true);assert.equal(receipt.commit,'cb56d73badb322f3725257c2e8cfd157b2c3989d');
assert.equal(crypto.createHash('sha256').update(fs.readFileSync(receipt.executable)).digest('hex'),receipt.executableSha256);
const texts=['','; comment','[Command]\ncommand=a','[Command]\nname=noquote\ncommand=a','[Command]\nname="a;broken"\ncommand=a','[Command]\nname="bad"\ncommand=ab','[Command]\nname="or"\ncommand=/a|b','[Command]\nname="empty"','[Command extra]\nname="extra"\ncommand=a','[Command]\nname="first"\nname="second"\ncommand=a\ncommand=b','[Command]\nname="a"\ncommand=a\n[Invalid\ncommand=b\n[Command]\nname="b"\ncommand=b','[Command]\nname="special"\ncommand=D,a\n[Command]\nname="other"\ncommand=b\n[Command]\nname="special"\ncommand=D,b', '[Remap]\na=x\nb=Y\n[Remap]\na=z\n[Defaults]\ncommand.buffer.time=4\n[Defaults]\ncommand.buffer.time=9\n[Command]\nname="remap"\ncommand=a|b'];
for(const value of ['',',4','0','-2','true','+4junk','2147483648','-2147483649',' 3 , 8','12.5'])for(const field of ['time','steptime','autogreater','buffer.time','buffer.hitpause','buffer.pauseend','buffer.shared'])texts.push(`[Defaults]\ncommand.${field}=6\n[Command]\nname="fixture"\ncommand=/B+a\n${field}=${value}`);
const original=texts.length;
for(const file of process.argv.slice(3))texts.push(fs.readFileSync(file,'utf8'));
const cases=texts.flatMap(FileText=>[false,true].flatMap(IgnoreErrors=>[[0,0,0],[1,0,0]].map(Version=>({FileText,IgnoreErrors,Version}))));
const run=spawnSync(receipt.executable,[],{input:JSON.stringify(cases),encoding:'utf8',maxBuffer:64*1024*1024,timeout:60000});assert.equal(run.status,0,run.stderr);
const native=JSON.parse(run.stdout);assert.equal(native.length,cases.length);let accepted=0,rejected=0,definitions=0;
for(const [index,input]of cases.entries()){
 const reference=native[index];assert.equal(reference.Panic,'');const expected=reference.File;assert(expected);
 let actual;try{actual=compileCommandFile(input.FileText,{engineVersions:{ikemen:input.Version},ignoreMostErrors:input.IgnoreErrors})}catch(error){assert.equal(error.message,expected.Error,`case ${index}`);rejected++;continue}
 assert.equal(expected.Error,'',`case ${index}`);assert.deepEqual(actual.defaults,expected.Defaults,`case ${index} defaults`);
 const plans=new Map();for(const d of actual.definitions){if(!plans.has(d.name))plans.set(d.name,[]);plans.get(d.name).push(d)}
 const commands=actual.list.commands.map(({name,matcher:m,shared})=>({Name:name,Time:m.maxTime,StepTime:m.maxStepTime,Buffer:m.maxBuffer,AutoGreater:plans.get(name).shift().autoGreater,HitPause:m.bufferHitPause,PauseEnd:m.bufferPauseEnd,Shared:shared,Steps:m.steps.map(step=>({Greater:step.greater,Or:step.orLogic,Keys:step.keys.length?step.keys.map(k=>({Key:k.key,Hold:k.hold,Release:k.release,Fourway:k.fourway,Charge:k.charge})):null})),Order:m.order}));
 assert.deepEqual(commands,expected.Commands,`case ${index} commands`);accepted++;definitions+=commands.length;
 const battle=createBattleCommandList(input.FileText,{engineVersions:{ikemen:input.Version},ignoreMostErrors:input.IgnoreErrors});
 assert.deepEqual(battle.native.commands.map(({name,matcher:m})=>({name,steps:m.steps,time:m.maxTime,stepTime:m.maxStepTime,buffer:m.maxBuffer})),actual.list.commands.map(({name,matcher:m})=>({name,steps:m.steps,time:m.maxTime,stepTime:m.maxStepTime,buffer:m.maxBuffer})),`case ${index} battle adapter`);
}
assert.equal(accepted+rejected,cases.length);
console.log(`PASS ${original} synthetic + ${texts.length-original} original CMD texts / ${cases.length} native policy cases: ${accepted} accepted, ${rejected} matching errors, ${definitions} definitions`);
