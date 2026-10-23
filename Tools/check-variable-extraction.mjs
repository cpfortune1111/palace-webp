import assert from 'node:assert/strict';
import {applyVariableController,assignExpressionVariable} from '../Engine/variables.js';

const binding={vars:Array(60).fill(9),fvars:Array(40).fill(9)};
for(const sample of [NaN,undefined,'12','text',true,1.5]){
 const evaluate=expression=>expression==='sample'?sample:Number(expression);
 applyVariableController({type:'VarSet',params:{fv:'0',value:'sample'}},binding,evaluate);
 assert.equal(binding.fvars[0],typeof sample==='number'&&!Number.isNaN(sample)?Math.fround(sample):sample===true?1:0);
 applyVariableController({type:'VarSet',params:{v:'0',value:'sample'}},binding,evaluate);
 assert.equal(binding.vars[0],typeof sample==='number'&&!Number.isNaN(sample)?Math.trunc(sample)|0:sample===true?1:0);
}
const sampled=[];
applyVariableController({type:'VarRangeSet',params:{first:'1',last:'2',value:'7',fvalue:'99'}},binding,expression=>{sampled.push(expression);return Number(expression)});
assert.deepEqual(binding.vars.slice(1,3),[7,7]);
assert.deepEqual(binding.fvars.slice(1,3),[9,9]);
assert.deepEqual(sampled,['1','2','7']);
const invalid=[];
applyVariableController({type:'VarRangeSet',params:{first:'-1',last:'2',value:'7'}},binding,expression=>{invalid.push(expression);return Number(expression)});
assert.deepEqual(invalid,['-1','2','7']);
applyVariableController({type:'VarSet',params:{v:'index',value:'8'}},binding,expression=>expression==='index'?NaN:Number(expression));
assert.equal(binding.vars[0],8);
applyVariableController({type:'VarSet',params:{v:'4294967296',value:'6'}},binding,Number,{compatibility:'ikemen'});
assert.equal(binding.vars[0],6);
const redirects=[];
applyVariableController({type:'VarSet',params:{redirectid:'id',v:'1',value:'3'}},binding,expression=>expression==='id'?'2':Number(expression),{findActor:id=>{redirects.push(id);return null}});
assert.deepEqual(redirects,[0]);
const assignment={vars:Array(60).fill(9),fvars:Array(40).fill(9),sysvars:Array(10).fill(9),sysfvars:Array(5).fill(9)};
for(const family of ['var','fvar','sysvar','sysfvar']){
 assert.equal(assignExpressionVariable(assignment,family,0,'12'),0);
 assert.equal(assignExpressionVariable(assignment,family,0,NaN),0);
 assert.equal(assignExpressionVariable(assignment,family,'12',7),7);
 const storage=assignment[{var:'vars',fvar:'fvars',sysvar:'sysvars',sysfvar:'sysfvars'}[family]];
 assert.equal(storage[0],7);
}
applyVariableController({type:'VarSet',params:{sysv:'3',value:'10'}},assignment,Number);
applyVariableController({type:'VarAdd',params:{sysfv:'2',value:'1.25'}},assignment,Number);
assert.equal(assignment.sysvars[3],10);
assert.equal(assignment.sysfvars[2],10.25);
assert.throws(()=>applyVariableController({type:'VarSet',params:{v:'1',fv:'2',value:'3'}},assignment,Number),/one variable/);
assignment.fvars[3]=NaN;
applyVariableController({type:'VarAdd',params:{fv:'3',value:'1'}},assignment,Number);
assert.ok(Number.isNaN(assignment.fvars[3]));
console.log('Variable controller extraction maps string/undefined operands to zero, preserves value precedence, signed indices and invalid-range RHS evaluation');
