// Differential grammar checks. No command-timing or Web battle certification.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {commandKeys,parseCommandSymbols} from '../Engine/command-symbols.js';
const receiptPath=process.argv[2];
if(!receiptPath)throw Error('Private native command build receipt required');
const receipt=JSON.parse(fs.readFileSync(receiptPath,'utf8'));
assert.equal(receipt.commit,'cb56d73badb322f3725257c2e8cfd157b2c3989d');
assert.equal(crypto.createHash('sha256').update(fs.readFileSync(receipt.executable)).digest('hex'),receipt.executableSha256);
const cases=[];
for(const key of commandKeys)for(const prefix of ['', '/', '~', '~3', '$', '~$', '/~3$', '>', '/15', '~2147483648','~4294967299','/ 2 5 '])cases.push({Command:prefix+key});
for(const a of commandKeys)for(const b of commandKeys)for(const separator of ['+','|'])cases.push({Command:a+separator+b});
for(const Command of ['', ' ', ',a','D,,a','a,','a|','a++b','a+b|c','ab','D F','//a','~~a','$$a','>>a','>a+>b','q','~','/','~0a','UQ','UBQ','/3~5a','~5/3a','a|/b,D','D,DF,F,a|b'])cases.push({Command});
cases.push({Command:'a|b',Remap:{a:'x',b:'y'}});
for(const space of ['\u0085','\u00a0','\u2003','\u2028','\u3000','\ufeff'])for(const form of [space,space+'a'+space,'/'+space+'3'+space+'a'])cases.push({Command:form});
for(const Command of ['é','月','😀','aé','~é'])cases.push({Command});
const synthetic=cases.length;
if(process.argv[3]){
 const corpus=JSON.parse(fs.readFileSync(process.argv[3],'utf8'));
 assert.equal(corpus.commit,receipt.commit);
 assert.ok(Array.isArray(corpus.cases)&&corpus.cases.length>0);
 cases.push(...corpus.cases);
}
const result=spawnSync(receipt.executable,[],{input:JSON.stringify(cases),encoding:'utf8',maxBuffer:16*1024*1024,timeout:60000});
assert.equal(result.status,0,result.stderr);
const native=JSON.parse(result.stdout);assert.equal(native.length,cases.length);
for(const [i,input] of cases.entries()){
 const actual=parseCommandSymbols(input.Command,{remap:input.Remap});
 const expected=native[i];assert.equal(expected.Panic,'',input.Command);
 assert.equal(actual.error,expected.Error,input.Command);
 assert.deepEqual(actual.steps,(expected.Steps??[]).map(step=>({keys:(step.Keys??[]).map(key=>({key:key.Key,hold:key.Hold,release:key.Release,fourway:key.Fourway,charge:key.Charge})),greater:step.Greater,orLogic:step.Or})),input.Command);
}
console.log(`PASS ${synthetic} synthetic and ${cases.length-synthetic} original Web/native command symbol grammar cases; timing and file policy excluded`);
