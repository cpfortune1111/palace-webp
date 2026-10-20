import assert from 'node:assert/strict';
import {contactDownRecovery,canGetUpFromLieDown,advanceDownRecovery} from '../Engine/down-recovery.js';

assert.equal(contactDownRecovery({requested:-1,defaultTime:60,stateType:'S'}),60);
assert.equal(contactDownRecovery({requested:9,defaultTime:60,stateType:'S'}),9);
assert.equal(contactDownRecovery({requested:9,defaultTime:60,priorTime:3,stateType:'L'}),3);
assert.equal(contactDownRecovery({requested:2,defaultTime:60,priorTime:3,stateType:'L'}),2);
assert.equal(contactDownRecovery({requested:-1,defaultTime:60,priorTime:80,stateType:'L'}),60);
const hit={'down.recovertime':1},actor={state:5110,time:0,assertions:new Set()};
assert.equal(canGetUpFromLieDown(actor,{paused:false,alive:true,hit}),false);
advanceDownRecovery(hit,{state:5110,paused:true});assert.equal(hit['down.recovertime'],1);
advanceDownRecovery(hit,{state:5000,paused:false});assert.equal(hit['down.recovertime'],1);
advanceDownRecovery(hit,{state:5110,paused:false});assert.equal(hit['down.recovertime'],0);
assert.equal(canGetUpFromLieDown(actor,{paused:false,alive:true,hit}),false);actor.time=1;
assert.equal(canGetUpFromLieDown(actor,{paused:false,alive:true,hit}),true);
assert.equal(canGetUpFromLieDown(actor,{paused:true,alive:true,hit}),false);
assert.equal(canGetUpFromLieDown(actor,{paused:false,alive:false,hit}),false);
actor.assertions.add('nogetupfromliedown');assert.equal(canGetUpFromLieDown(actor,{paused:false,alive:true,hit}),false);
console.log('Pinned down recovery contact limits, eligible clock progression, minimum frame, alive/pause/assertion gates pass; full scheduler remains uncertified');
