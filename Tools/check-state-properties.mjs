import assert from 'node:assert/strict';
import {applyStatePropertyController} from '../Engine/state-properties.js';

const caller={ctrl:0,type:'S',moveType:'I',physics:'S'},target={ctrl:0,type:'C',moveType:'H',physics:'C'};
const api={evaluate:value=>value==='caller'?caller.ctrl:Number(value),findActor:id=>id===7?target:null};
const run=(type,params)=>applyStatePropertyController({type,params},caller,api);
run('CtrlSet',{value:'-2'});assert.equal(caller.ctrl,1);
run('CtrlSet',{redirectid:'7',value:'caller'});assert.equal(target.ctrl,1);
run('CtrlSet',{value:'0'});assert.equal(caller.ctrl,0);
run('StateTypeSet',{redirectid:'7',value:'a',movetype:'i',physics:'n'});assert.deepEqual(target,{ctrl:1,type:'A',moveType:'I',physics:'N'});
run('StateTypeSet',{value:'L',statetype:'C',moveType:'H'});assert.equal(caller.type,'C');assert.equal(caller.moveType,'H');assert.equal(caller.physics,'S');
run('StateTypeSet',{redirectid:'99',statetype:'A'});assert.equal(caller.type,'C');
assert.throws(()=>run('CtrlSet',{}),/Missing/);
assert.throws(()=>run('StateTypeSet',{physics:'L'}),/Invalid/);
const previous={...caller};
assert.throws(()=>run('StateTypeSet',{statetype:'A',movetype:'I',physics:'L'}),/Invalid/);
assert.deepEqual(caller,previous);
assert.throws(()=>run('StateTypeSet',{statetype:'A',movetype:'unknown'}),/Invalid/);
assert.deepEqual(caller,previous);
assert.throws(()=>run('StateTypeSet',{statetype:'A',physics:''}),/Invalid/);
assert.deepEqual(caller,previous);
assert.equal(run('Null',{}),false);
console.log('Control boolean conversion, state type aliases, omitted fields and caller-context redirection passed');
caller.facing=1;caller.vx=3;target.facing=-1;target.vx=5;
run('Turn',{});assert.equal(caller.facing,-1);assert.equal(caller.vx,-3);
run('Turn',{redirectid:'7'});assert.equal(target.facing,1);assert.equal(target.vx,-5);
run('Turn',{redirectid:'99'});assert.equal(caller.facing,-1);
console.log('Turn target-facing and relative-velocity reversal passed');
run('SprPriority',{value:'5.8'});assert.equal(caller.sprPriority,5);
run('SprPriority',{redirectid:'7',value:'-3.9'});assert.equal(target.sprPriority,-3);
run('SprPriority',{});assert.equal(caller.sprPriority,0);
run('SprPriority',{redirectid:'99',value:'22'});assert.equal(caller.sprPriority,0);
assert.throws(()=>run('SprPriority',{layerno:'1'}),/layerno rendering/);
console.log('Sprite priority defaults, integer conversion, ownership and redirection passed');
for(const operand of ['1',NaN,undefined]){
 const sampleApi={...api,evaluate:()=>operand};
 caller.ctrl=1;
 applyStatePropertyController({type:'CtrlSet',params:{value:'operand'}},caller,sampleApi);
 assert.equal(caller.ctrl,0);
 applyStatePropertyController({type:'SprPriority',params:{layerno:'operand',value:'operand'}},caller,sampleApi);
 assert.equal(caller.sprPriority,0);
 for(const type of ['CtrlSet','StateTypeSet','Turn','SprPriority']){
  const ids=[],reads=[];
  applyStatePropertyController({type,params:{redirectid:'redirect',value:'rhs'}},caller,{...api,evaluate:expression=>{reads.push(expression);return expression==='redirect'?operand:1},findActor:id=>{ids.push(id);return null}});
  assert.deepEqual(ids,[0]);assert.deepEqual(reads,['redirect']);
 }
}


