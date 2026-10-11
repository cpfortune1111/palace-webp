import assert from 'node:assert/strict';
import {createDefenseState,effectiveCustomDefense,applyDefenseController} from '../Engine/defense-controllers.js';

const caller={defenseState:createDefenseState()},target={defenseState:createDefenseState()};
const api={compatibility:'mugen',evaluate:Number,findActor:id=>id===7?target:null};
const run=params=>applyDefenseController({type:'DefenceMulSet',params},caller,api);
run({value:'2'});assert.deepEqual(caller.defenseState,{customDefense:0.5,onHit:true});
assert.equal(effectiveCustomDefense(caller.defenseState,'I'),1);assert.equal(effectiveCustomDefense(caller.defenseState,'H'),0.5);
run({redirectid:'7',value:'4',multype:'1',onhit:'0'});assert.equal(effectiveCustomDefense(target.defenseState,'I'),4);
run({redirectid:'99',value:'5'});assert.equal(caller.defenseState.customDefense,0.5);
api.compatibility='ikemen';run({value:'3'});assert.deepEqual(caller.defenseState,{customDefense:3,onHit:false});
assert.throws(()=>run({value:'2',multype:'2'}),/Invalid/);
assert.throws(()=>run({}),/Missing/);
console.log('Defense native version defaults, delay, reciprocal/direct multiplier and redirection passed');
