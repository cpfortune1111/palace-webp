import assert from 'node:assert/strict';
import {createMakeDustState,advanceMakeDust,applyMakeDustController} from '../Engine/make-dust-controller.js';

const caller={state:createMakeDustState()},target={state:createMakeDustState()},emitted=[],warnings=[],order=[];
let suppressed=false;
const api={evaluate:value=>{order.push(value);return Number(value)},split:value=>String(value).split(','),findActor:id=>id===2?target:null,state:actor=>actor.state,suppressed:()=>suppressed,emit:(actor,position)=>emitted.push({actor,position}),warn:message=>warnings.push(message)};
assert.equal(applyMakeDustController({type:'Null'},caller,api),false);
applyMakeDustController({type:'MakeDust',params:{}},caller,api);assert.equal(emitted.length,0);
for(let tick=0;tick<3;tick++){advanceMakeDust(caller.state,tick);advanceMakeDust(caller.state,tick)}
assert.equal(caller.state.elapsed,3);applyMakeDustController({type:'MakeDust',params:{}},caller,api);assert.deepEqual(emitted.shift(),{actor:caller,position:[0,0,0]});assert.equal(caller.state.elapsed,0);
advanceMakeDust(caller.state,3,{paused:true});assert.equal(caller.state.elapsed,0);advanceMakeDust(caller.state,3);assert.equal(caller.state.elapsed,1);
target.state.elapsed=3;order.length=0;
applyMakeDustController({type:'MakeDust',params:{redirectid:'2',spacing:'2',pos:'1,2,3',pos2:'4,5,6'}},caller,api);
assert.deepEqual(order,['2','2','1','2','3','4','5','6']);assert.deepEqual(emitted.shift(),{actor:target,position:[1,2,3]});assert.equal(emitted.length,0);assert.equal(target.state.elapsed,0);assert.equal(caller.state.elapsed,1);
target.state.elapsed=3;suppressed=true;applyMakeDustController({type:'MakeDust',params:{redirectid:'2',spacing:'0'}},caller,api);assert.equal(target.state.elapsed,3);assert.equal(warnings.length,0);
suppressed=false;applyMakeDustController({type:'MakeDust',params:{redirectid:'2',spacing:'0',pos2:'7'}},caller,api);assert.deepEqual(emitted.shift(),{actor:target,position:[0,0,0]});assert.equal(warnings.length,2);assert.equal(emitted.length,0);
order.length=0;applyMakeDustController({type:'MakeDust',params:{redirectid:'99',pos:'bad'}},caller,api);assert.deepEqual(order,['99']);
target.state.elapsed=2;applyMakeDustController({type:'MakeDust',params:{redirectid:'2',spacing:'1',pos:'ignored,ignored,ignored'}},caller,{...api,evaluate:value=>value==='2'?2:value==='1'?1:value});assert.deepEqual(emitted.shift().position,[0,0,0]);
assert.throws(()=>applyMakeDustController({type:'MakeDust',params:{pos:'1,2,3,4'}},caller,api),/Invalid/);
console.log('Pinned MakeDust extraction, redirection, default/invalid spacing, independent clocks, suppression and shared-clock second-position behavior pass; actual drawing is verified separately');
