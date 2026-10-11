import assert from 'node:assert/strict';
import {applyVariableController} from '../Engine/variables.js';

const binding={vars:Array(60).fill(0),fvars:Array(40).fill(0),sysvars:Array(10).fill(0),sysfvars:Array(5).fill(0)};
const evaluate=expression=>expression==='index'?3:Number(expression);
for(const [kind,storage] of [['var','vars'],['fvar','fvars'],['sysvar','sysvars'],['sysfvar','sysfvars']]){
 const floating=kind.includes('fvar');
 assert.equal(applyVariableController({type:'VarSet',params:{target:kind+'(index)',value:'2.75'}},binding,evaluate),true);
 assert.equal(binding[storage][3],floating?2.75:2);
 applyVariableController({type:'VarAdd',params:{target:kind+'(3)',value:'-1.5'}},binding,evaluate);
 assert.equal(binding[storage][3],floating?1.25:1);
 applyVariableController({type:'VarSet',params:{target:kind+'(-1)',value:'7'}},binding,evaluate);
 assert.equal(binding[storage][-1],undefined);
}
applyVariableController({type:'varset',params:{fv:'2',value:'3.5'}},binding,evaluate);
assert.equal(binding.fvars[2],3.5);
applyVariableController({type:'varset',params:{v:'2',value:'3.5'}},binding,evaluate);
assert.equal(binding.vars[2],3);
assert.equal(applyVariableController({type:'Null'},binding,evaluate),false);
console.log('Variable types, native targets, expression indices and bounds passed');
