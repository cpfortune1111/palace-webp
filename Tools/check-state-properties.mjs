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
assert.equal(run('Null',{}),false);
console.log('Control boolean conversion, state type aliases, omitted fields and caller-context redirection passed');
caller.facing=1;caller.vx=3;target.facing=-1;target.vx=5;
run('Turn',{});assert.equal(caller.facing,-1);assert.equal(caller.vx,-3);
run('Turn',{redirectid:'7'});assert.equal(target.facing,1);assert.equal(target.vx,-5);
run('Turn',{redirectid:'99'});assert.equal(caller.facing,-1);
console.log('Turn target-facing and relative-velocity reversal passed');

