import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {applyAssertInputController,createAssertInputState,mergeAssertedCommandInput} from '../Engine/assert-input.js';

const state=createAssertInputState(),caller={key:'root1',facing:1},other={key:'root2',facing:-1},api={evaluate:Number,findActor:id=>id===2?other:null,assert:(owner,flags)=>state.add(owner.key,flags)};
assert.equal(applyAssertInputController({type:'Other'},caller,api),false);
assert.throws(()=>applyAssertInputController({type:'AssertInput',params:{}},caller,api),/at least one/);
assert.throws(()=>applyAssertInputController({type:'AssertInput',params:{flag:'A'}},caller,api),/Invalid/);
applyAssertInputController({type:'AssertInput',params:{redirectid:2,flag:'F',flag2:'a',flag8:'m'}},caller,api);
other.facing=1;
const flags=state.take('root2');assert.deepEqual([...flags],['L','a','m']);
assert.deepEqual(mergeAssertedCommandInput({U:true,F:false},flags,other.facing),{U:true,F:false,B:true,a:true,m:true});
assert.equal(state.take('root2').size,0);assert.equal(state.take('root1').size,0);
for(const flag of ['U','D','L','R','a','b','c','x','y','z','s','d','w','m','B','F'])applyAssertInputController({type:'AssertInput',params:{flag}},caller,api);
assert.equal(state.take('root1').size,14);
for(let slot=1;slot<=8;slot++){
 const name=slot===1?'flag':'flag'+slot;
 applyAssertInputController({type:'AssertInput',params:{[name]:'x'}},caller,api);
 assert.deepEqual([...state.take('root1')],['x']);
}
applyAssertInputController({type:'AssertInput',params:{redirectid:99,flag:'x'}},caller,api);assert.equal(state.take('root1').size,0);
state.add('root1',['a']);state.clear();assert.equal(state.take('root1').size,0);
const inventory=JSON.parse(readFileSync(new URL('../Docs/CONTROLLER-AUDIT.json',import.meta.url),'utf8'));
const evidence=JSON.parse(readFileSync(new URL('../Docs/ASSERT-INPUT-PARAMETER-EVIDENCE.json',import.meta.url),'utf8'));
assert.deepEqual(evidence.rows.map(row=>row.parameter).sort(),inventory.controllers.find(row=>row.controller==='assertinput').parameterCandidates);
assert.equal(evidence.certifiedParameters,0);
console.log('AssertInput validates all eight slots, preserves case, resolves facing on redirected actor, unions physical flags and consumes once');
