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
