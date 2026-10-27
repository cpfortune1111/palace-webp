import assert from 'node:assert/strict';
import {createDefenseState,effectiveCustomDefense,applyDefenseController,compileDefenseMulType} from '../Engine/defense-controllers.js';

const caller={defenseState:createDefenseState()},target={defenseState:createDefenseState()};
const api={compatibility:'mugen',evaluate:Number,findActor:id=>id===7?target:null};
const run=params=>applyDefenseController({type:'DefenceMulSet',params},caller,api);
run({value:'2'});assert.deepEqual(caller.defenseState,{customDefense:0.5,onHit:true});
assert.equal(effectiveCustomDefense(caller.defenseState,'I'),1);assert.equal(effectiveCustomDefense(caller.defenseState,'H'),0.5);
run({redirectid:'7',value:'4',multype:'1',onhit:'0'});assert.equal(effectiveCustomDefense(target.defenseState,'I'),4);
run({redirectid:'99',value:'5'});assert.equal(caller.defenseState.customDefense,0.5);
api.compatibility='ikemen';run({value:'3'});assert.deepEqual(caller.defenseState,{customDefense:3,onHit:false});
assert.throws(()=>run({value:'2',multype:'2'}),/Invalid/);
assert.throws(()=>run({value:'4',multype:'-3'}),/Invalid/);
const numeric=api.evaluate;
api.evaluate=value=>value==='var(8)'?0:value==='var(9)'?-7:numeric(value);
run({value:'4',multype:'var(8)'});assert.equal(caller.defenseState.customDefense,0.25);
run({value:'4',multype:'var(9)',redirectid:'7'});assert.equal(target.defenseState.customDefense,0.25);
api.evaluate=numeric;
assert.equal(compileDefenseMulType('1 + 1'),1);
assert.equal(compileDefenseMulType('  +0.8'),0);
assert.equal(compileDefenseMulType('var(8)'),0);
assert.throws(()=>compileDefenseMulType('2147483648'),/Invalid/);
assert.throws(()=>compileDefenseMulType('-2147483648'),/Invalid/);
assert.throws(()=>run({}),/Missing/);
console.log('Defense native version defaults, delay, reciprocal/direct multiplier and redirection passed');
caller.defenseState.customDefense=3;
const sampled=[];
const ordered={...api,evaluate:expression=>{sampled.push(expression);return expression==='olddefense'?Number(caller.defenseState.customDefense===3):Number(expression)}};
applyDefenseController({type:'DefenceMulSet',params:{value:'2',onhit:'olddefense'}},caller,ordered);
assert.deepEqual(caller.defenseState,{customDefense:2,onHit:true});
assert.deepEqual(sampled,['2','olddefense']);
sampled.length=0;
applyDefenseController({type:'DefenceMulSet',params:{value:'4'}},caller,ordered);
assert.deepEqual(sampled,['4']);
assert.deepEqual(caller.defenseState,{customDefense:4,onHit:false});
for(const [ikemen,expected] of [[[0,0,9],{customDefense:0.5,onHit:true}],[[0,99,0],{customDefense:2,onHit:false}]]){
 applyDefenseController({type:'DefenceMulSet',params:{value:'2'}},caller,{...api,compatibility:ikemen[1]?'mugen':'ikemen',versionData:{engineVersions:{mugen:[1,1],ikemen}}});
 assert.deepEqual(caller.defenseState,expected);
}
