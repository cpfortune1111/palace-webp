import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {commandBufferPolicy} from '../Engine/command-buffer-policy.js';
if(!process.argv[2])throw Error('Private pinned command-policy receipt required');
const receipt=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));assert.equal(receipt.commit,'cb56d73badb322f3725257c2e8cfd157b2c3989d');
assert.equal(crypto.createHash('sha256').update(fs.readFileSync(receipt.executable)).digest('hex'),receipt.executableSha256);
const cases=[];
for(const HitPause of [false,true])for(const PauseOnHitPause of [0,1,-1])for(const Ikemen of [[0,0,0],[0,1,0],[1,0,0]])for(const Mugen of [[0,5],[1,0],[1,1]])for(const Helper of [false,true])for(const SuperTime of [0,1,4])for(const PauseTime of [0,1,4])for(const SuperMoveTime of [-1,0,1])for(const PauseMoveTime of [-1,0,1])cases.push({HitPause,PauseOnHitPause,Ikemen,Mugen,Helper,SuperTime,PauseTime,SuperMoveTime,PauseMoveTime,SuperEndBuffer:2,PauseEndBuffer:2});
for(const remaining of [1,2,3])for(const window of [-1,0,1,2,3,4])for(const slot of ['Super','Pause'])cases.push({HitPause:true,PauseOnHitPause:1,Ikemen:[0,0,0],Mugen:[0,5],Helper:true,SuperTime:slot==='Super'?remaining:0,PauseTime:slot==='Pause'?remaining:0,SuperMoveTime:0,PauseMoveTime:0,SuperEndBuffer:window,PauseEndBuffer:window});
for(const PauseOnHitPause of [1e-50,-1e-50,1e-40,-1e-40])cases.push({HitPause:true,PauseOnHitPause,Ikemen:[0,0,0],Mugen:[1,0],Helper:false,SuperTime:0,PauseTime:0,SuperMoveTime:0,PauseMoveTime:0,SuperEndBuffer:0,PauseEndBuffer:0});
const run=spawnSync(receipt.executable,[],{input:JSON.stringify(cases),encoding:'utf8',maxBuffer:16*1024*1024,timeout:60000});assert.equal(run.status,0,run.stderr);
const native=JSON.parse(run.stdout);assert.equal(native.length,cases.length);let winExtras=0;
for(const [index,v]of cases.entries()){
 const actual=commandBufferPolicy({hitPause:v.HitPause,pauseOnHitPause:v.PauseOnHitPause,sourceVersions:{ikemen:v.Ikemen,mugen:v.Mugen},helper:v.Helper,superTime:v.SuperTime,pauseTime:v.PauseTime,superMoveTime:v.SuperMoveTime,pauseMoveTime:v.PauseMoveTime,superEndBuffer:v.SuperEndBuffer,pauseEndBuffer:v.PauseEndBuffer});
 const e=native[index];assert.deepEqual(actual,{active:e.Active,hitPause:e.HitPause,pauseEnd:e.PauseEnd,extra:e.Extra,helperRestricted:e.HelperRestricted},`case ${index}`);if(actual.extra===2)winExtras++;
}
assert(winExtras>0);console.log(`PASS ${cases.length} native commandUpdate policy combinations, including precedence, end-window bounds, movement allowances and WinMUGEN extra buffering`);
