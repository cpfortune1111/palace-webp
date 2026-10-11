import assert from 'node:assert/strict';
import {createAttackState,applyAttackController} from '../Engine/attack-controllers.js';

const caller={attackState:createAttackState()},target={attackState:createAttackState()};
const api={evaluate:Number,findActor:id=>id===7?target:null};
const run=params=>applyAttackController({type:'AttackMulSet',params},caller,api);
run({value:'2',damage:'3'});assert.deepEqual(caller.attackState,{damage:3,redlife:2,dizzypoints:2,guardpoints:2});
run({redirectid:'7',damage:'0.5'});assert.equal(target.attackState.damage,0.5);
const projectile={...target.attackState};run({redirectid:'7',value:'4'});assert.equal(projectile.damage,0.5);
run({redirectid:'99',damage:'5'});assert.equal(caller.attackState.damage,3);
assert.throws(()=>run({}),/Missing/);
console.log('Attack multiplier defaults, value/field precedence, redirection and projectile snapshots passed');
