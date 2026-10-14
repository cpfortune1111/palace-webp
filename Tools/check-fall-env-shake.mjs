import assert from 'node:assert/strict';
import {applyFallEnvShake} from '../Engine/fall-env-shake.js';
const caller={},recipient={hit:{'fall.envshake.time':6,'fall.envshake.freq':90,'fall.envshake.ampl':3,shake:{freq:60,ampl:-4}}};let started;
const api={evaluate:Number,findActor:id=>id===2?recipient:null,getHit:actor=>actor.hit,amplitudeScale:()=>2,start:value=>{started=value}};
applyFallEnvShake({type:'FallEnvShake',params:{redirectid:2}},caller,api);
assert.equal(started.remaining,6);assert.equal(started.params.freq,90);assert.equal(started.params.ampl,6);assert.equal(recipient.hit['fall.envshake.time'],0);
assert.equal(started.params.phase,90);
started=null;applyFallEnvShake({type:'FallEnvShake',params:{redirectid:2}},caller,api);assert.equal(started,null);
console.log('FallEnvShake redirected data, canonical field precedence, caller amplitude scale and single consumption passed');
