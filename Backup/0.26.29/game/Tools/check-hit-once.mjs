import assert from 'node:assert/strict';
import {hitOnceParameter,consumesHitOnce,consumeHitOnceContact} from '../Engine/hit-once.js';

assert.equal(hitOnceParameter({attr:'S, NA'}),false);
for(const attr of ['S, NT','C, ST','A, HT','S, NA, NT'])assert.equal(hitOnceParameter({attr}),true);
assert.equal(hitOnceParameter({attr:'S, NT',hitonce:0}),false);
assert.equal(hitOnceParameter({attr:'S, NA',hitonce:0.5}),true);
assert.equal(hitOnceParameter({attr:'S, NA',hitonce:-1}),true);
assert.equal(consumesHitOnce({hitonce:1},{accepted:false}),false);
assert.equal(consumesHitOnce({hitonce:1},{accepted:true}),true);
assert.equal(consumesHitOnce({hitonce:1},{accepted:true,isProjectile:true}),false);
const hitDef={params:{hitonce:1}};
assert.equal(consumeHitOnceContact(hitDef,{accepted:false}),false);
assert.equal(hitDef.hitOnceSpent,undefined);
assert.equal(consumeHitOnceContact(hitDef,{accepted:true}),true);
assert.equal(hitDef.hitOnceSpent,true);
const nextActivation={params:{hitonce:1}};
assert.equal(nextActivation.hitOnceSpent,undefined);
console.log('HitOnce defaults, explicit booleans and accepted character-contact consumption passed');
