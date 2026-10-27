import assert from 'node:assert/strict';
import {applyEnvShake} from '../Engine/env-shake-controller.js';
let state;const calls=[],api={evaluate:value=>{calls.push(value);return Number(value)},nativeLocalScale:()=>0.25,nativeToWorld:()=>4,start:value=>{state=value}};
applyEnvShake({type:'EnvShake',params:{time:2,ampl:7,phase:270,freq:-10,dir:90}}, {},api);
assert.equal(state.params.ampl,4);assert.equal(state.params.phase,180);assert.equal(state.params.freq,0);assert.deepEqual(calls,[2,7,270,-10,90]);
applyEnvShake({type:'EnvShake',params:{time:2,freq:90}}, {},api);assert.equal(state.params.ampl,-16);assert.equal(state.params.phase,90);
applyEnvShake({type:'EnvShake',params:{}}, {},api);assert.equal(state,null);
console.log('Native EnvShake compiler order, integer amplitude rounding, clamps, defaults and replacement passed');
for(const raw of [NaN,'3','Moon'])for(const name of ['phase','freq','mul','dir','diradd','decay']){
 applyEnvShake({type:'EnvShake',params:{time:2,freq:90,[name]:'operand'}},{},{...api,evaluate:expression=>expression==='operand'?raw:Number(expression)});
 assert.equal(state.params[name],0,name);
}
applyEnvShake({type:'EnvShake',params:{time:'operand'}},{},{...api,evaluate:expression=>expression==='operand'?'3':Number(expression)});
assert.equal(state,null);
applyEnvShake({type:'EnvShake',params:{time:2,ampl:'operand'}},{},{...api,evaluate:expression=>expression==='operand'?'3':Number(expression)});
assert.equal(state.params.ampl,0);
