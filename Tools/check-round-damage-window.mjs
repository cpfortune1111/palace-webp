import assert from 'node:assert/strict';
import {roundDamageBlocked} from '../Engine/round-damage-window.js';
import {createRoundFlow} from '../Engine/round-flow-runtime.js';

assert.equal(roundDamageBlocked(0,0,45),false);
assert.equal(roundDamageBlocked(9,10,45),false);
assert.equal(roundDamageBlocked(10,10,45),true);
assert.equal(roundDamageBlocked(45,10,45),true);
assert.equal(roundDamageBlocked(46,10,45),false);
assert.equal(roundDamageBlocked(10,20,5),false);
const api={config:{startWait:0,controlWait:0,overHitTime:10,overWait:45,winTime:60,overTime:210,matchWins:2,maxDraws:2},rounds:{},setTimer(){},reset(){},initialize(){},message(){},lock(){},fade(){},stepPresentation(){},introComplete:()=>true,voiceReady:()=>true,announcerReady:()=>true,sound(){},fight(){},life:()=>[100,50],remaining:()=>99,stopCombat(){},stepResult(){},settled:()=>true,pose(){},matchEnd(){}};
const flow=createRoundFlow(api);
flow.begin('vs','99');
while(flow.snapshot().phase!=='fight'){assert.equal(flow.noDamage(),false);flow.step()}
flow.finish('time');assert.equal(flow.noDamage(),false);
for(let tick=1;tick<=90;tick++){flow.step();assert.equal(flow.snapshot().postRoundAge,tick);assert.equal(flow.noDamage(),tick>=10&&tick<=45)}
flow.begin('training','infinite');assert.equal(flow.snapshot().postRoundAge,0);assert.equal(flow.noDamage(),false);
console.log('Native post-round damage window boundaries and continuous phase clock passed');
