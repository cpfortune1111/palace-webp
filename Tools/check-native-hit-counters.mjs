import assert from 'node:assert/strict';
import {createNativeHitCounters} from '../Engine/native-hit-counters.js';

const counters=createNativeHitCounters();
counters.contact('first','second',{numHits:3,side:0});
assert.deepEqual(counters.actor('first'),{uniqHitCount:1,receivedHits:0});assert.equal(counters.actor('second').receivedHits,3);assert.equal(counters.comboCount(0),3);
counters.contact('projectile','second',{unique:false,numHits:2,side:0});assert.equal(counters.actor('projectile').uniqHitCount,0);assert.equal(counters.actor('second').receivedHits,5);
counters.contact('first','second',{received:false,side:0});assert.equal(counters.actor('first').uniqHitCount,2);assert.equal(counters.actor('second').receivedHits,5);
counters.finishActor('second',{moveType:'H',guarded:true,hitPause:true});assert.equal(counters.actor('second').receivedHits,5);
counters.finishActor('second',{moveType:'I',dizzy:true});assert.equal(counters.actor('second').receivedHits,5);
counters.finishActor('second',{moveType:'H'});assert.equal(counters.actor('second').receivedHits,5);
counters.finishCombos([{key:'second',side:1,alive:false,overKo:false}]);assert.equal(counters.comboCount(0),5);
counters.finishCombos([{key:'second',side:1,alive:false,overKo:true}]);assert.equal(counters.comboCount(0),0);
counters.finishActor('second',{moveType:'H',guarded:true});assert.equal(counters.actor('second').receivedHits,0);
counters.addComboHits(1,2147483647);counters.addComboHits(1,1);assert.equal(counters.comboCount(1),-2147483648);counters.addComboHits(-1,9);assert.equal(counters.comboCount(-1),0);
counters.resetSource('first');assert.equal(counters.actor('first').uniqHitCount,0);counters.delete('first');assert.equal(counters.actor('first').receivedHits,0);
const snapshot=counters.snapshot();counters.actor('first').receivedHits=99;counters.restore(snapshot);assert.equal(counters.actor('first').receivedHits,0);assert.equal(counters.comboCount(1),-2147483648);
counters.clear();assert.equal(counters.comboCount(1),0);
console.log('Native hit counters separate unique contacts, received NumHits and signed team combos, preserve paused/dizzy values and reset by native recipient/HUD eligibility');
