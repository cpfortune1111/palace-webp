import assert from 'node:assert/strict';
import {applyStatusController} from '../Engine/status-controllers.js';

const root={dizzy:false,guardBreak:false},helper={dizzy:false,guardBreak:false};
const api={evaluate:value=>value==='var(8)'?99:Number(value),findActor:id=>id===99?helper:null,setFlag:(actor,field,value)=>{actor[field]=value}};
applyStatusController({type:'DizzySet',params:{value:0.5}},root,api);assert.equal(root.dizzy,true);
applyStatusController({type:'GuardBreakSet',params:{redirectid:'var(8)',value:-1}},root,api);assert.equal(helper.guardBreak,true);assert.equal(root.guardBreak,false);
applyStatusController({type:'DizzySet',params:{value:0}},root,api);assert.equal(root.dizzy,false);
assert.throws(()=>applyStatusController({type:'GuardBreakSet',params:{}},helper,api),/Missing GuardBreakSet value/);assert.equal(helper.guardBreak,true);
assert.equal(applyStatusController({type:'CtrlSet',params:{value:0}},root,api),false);
console.log('DizzySet/GuardBreakSet caller booleans, redirected helper flags and required-value validation passed');