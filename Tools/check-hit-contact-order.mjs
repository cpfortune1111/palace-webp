import assert from 'node:assert/strict';
import {orderedHitContactCandidates} from '../Engine/hit-contact-order.js';

const candidates=[{id:5,distance:1},{id:9,distance:100,reversal:true},{id:3,distance:-4,reversal:true},{id:2,distance:4,reversal:true},{id:1,distance:1}];
const options={distance:actor=>actor.distance,id:actor=>actor.id,reversal:actor=>actor.reversal};
assert.deepEqual(orderedHitContactCandidates(candidates,options).map(actor=>actor.id),[2,3,9,1,5]);
assert.deepEqual(candidates.map(actor=>actor.id),[5,9,3,2,1]);
assert.deepEqual(orderedHitContactCandidates([{id:2,distance:1},{id:1,distance:1+1e-9}],options).map(actor=>actor.id),[1,2]);
assert.deepEqual(orderedHitContactCandidates([],options),[]);
console.log('Native contact order puts reversals first, preserves absolute float32 distance and player-ID ties without mutating candidates');
