import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {CommandInputBuffer} from '../Engine/command-input-buffer.js';
import {commandKeys,parseCommandSymbols} from '../Engine/command-symbols.js';
if(!process.argv[2])throw Error('Private pinned native command receipt required');
const receipt=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
assert.equal(receipt.commit,'cb56d73badb322f3725257c2e8cfd157b2c3989d');
assert.equal(crypto.createHash('sha256').update(fs.readFileSync(receipt.executable)).digest('hex'),receipt.executableSha256);
const queries=commandKeys.flatMap(key=>['','~','$','~$'].map(prefix=>prefix+key));
const tokens=queries.map(query=>parseCommandSymbols(query).steps[0].keys[0]);
const frames=[],bits=['U','D','L','R'];
for(let first=0;first<16;first++)for(let second=0;second<16;second++)for(const mask of [first,first,second,second])frames.push({Held:bits.filter((_,bit)=>mask&(1<<bit)),Facing:(first+second)%2?-1:1});
let random=179;
const next=()=>{random=(Math.imul(random,1664525)+1013904223)>>>0;return random};
for(let i=0;i<500;i++)frames.push({Held:[...bits,...commandKeys.slice(15)].filter(()=>next()%5<2),Facing:next()%2?-1:1});
// Include quiet periods, button charge/release and facing changes while held.
for(const key of commandKeys.slice(15))for(const held of [[key],[key],[key],[],[]])frames.push({Held:held,Facing:1});
frames.push({Held:['L'],Facing:1},{Held:['L'],Facing:-1},{Held:[],Facing:-1});
const request={Command:'a',Time:15,StepTime:15,Buffer:2,Frames:frames.map(frame=>({...frame,Queries:queries}))};
const result=spawnSync(receipt.executable,[],{input:JSON.stringify([request]),encoding:'utf8',maxBuffer:64*1024*1024,timeout:60000});
assert.equal(result.status,0,result.stderr);
const [native]=JSON.parse(result.stdout);assert.equal(native.Error,'');assert.equal(native.Panic,'');assert.equal(native.Ticks.length,frames.length);
const buffer=new CommandInputBuffer();let comparisons=0;
for(const [index,frame] of frames.entries()){
 buffer.updatePhysical(Object.fromEntries(frame.Held.map(key=>[key,true])),frame.Facing);
 for(const [j,query] of queries.entries()){
  assert.equal(buffer.state(tokens[j]),native.Ticks[index].States[query],`frame ${index} State ${query}`);
  assert.equal(buffer.charge(tokens[j]),native.Ticks[index].States[query+':charge'],`frame ${index} Charge ${query}`);comparisons+=2;
 }
}
console.log(`PASS ${comparisons} Web/native input State/StateCharge comparisons across ${frames.length} ticks`);
