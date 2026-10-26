import assert from 'node:assert/strict';
import {juggleBudget,juggleContactAllowed,inheritJuggleCandidate,inheritJuggleContact,consumeJuggleContact,applyStateDefJuggle,createJuggleState} from '../Engine/juggle-state.js';

const prior=[[1,9],[2,4]];
assert.equal(juggleBudget(prior,1,15),9);assert.equal(juggleBudget(prior,7,15),15);
assert.equal(juggleContactAllowed({cost:10,remaining:9,hasTarget:true}),false);
assert.equal(juggleContactAllowed({cost:10,remaining:9}),true);
assert.equal(juggleContactAllowed({cost:10,remaining:9,projectile:true}),false);
assert.equal(juggleContactAllowed({cost:10,remaining:9,ikemen:true,hitState:1,projectile:true}),true);
assert.equal(juggleContactAllowed({cost:10,remaining:9,ikemen:true,hitState:2}),false);
assert.equal(juggleContactAllowed({cost:10,remaining:9,ikemen:true,hitState:2,noCheck:true}),true);
assert.deepEqual(inheritJuggleCandidate(prior,{sourceId:3,originId:1}),[[1,9],[2,4],[3,9]]);
assert.deepEqual(inheritJuggleCandidate(prior,{sourceId:2,originId:1}),[[1,9],[2,4]]);
assert.equal(inheritJuggleCandidate(prior,{sourceId:3,originId:8}),prior);
assert.deepEqual(inheritJuggleContact(prior,{sourceId:2,originId:1,maximum:15,cost:3}),[[2,4],[1,1]]);
assert.deepEqual(consumeJuggleContact(prior,1,{cost:3,fall:true}),{entries:[[1,6],[2,4]],clearCost:true});
assert.deepEqual(consumeJuggleContact(prior,1,{cost:3,previousFall:true,projectile:true}),{entries:[[1,6],[2,4]],clearCost:false});
assert.deepEqual(consumeJuggleContact(prior,1,{cost:3,fall:true,noCheck:true}),{entries:prior,clearCost:true});
for(const options of [{guarded:true},{overridden:true},{getHitSet:false}])assert.deepEqual(consumeJuggleContact(prior,1,{cost:3,fall:true,...options}),{entries:prior,clearCost:false});
assert.deepEqual(consumeJuggleContact(prior,1,{cost:3}),{entries:prior,clearCost:false});
assert.throws(()=>consumeJuggleContact([],1,{cost:3,fall:true}),/Missing accepted-contact/);
assert.deepEqual(prior,[[1,9],[2,4]]);
const state=createJuggleState();let evaluations=0;
const api={evaluate:value=>{evaluations++;return Number(value)},setCost:value=>state.set('helper',value)};
assert.equal(applyStateDefJuggle({},api),false);assert.equal(evaluations,0);
assert.equal(applyStateDefJuggle({juggle:'3.9'},api),true);assert.equal(evaluations,1);assert.equal(state.cost('helper'),3);
state.finish('helper',{ikemen:true,moveType:'I',actionRun:false});assert.equal(state.cost('helper'),3);
state.finish('helper',{ikemen:false,moveType:'I'});assert.equal(state.cost('helper'),3);
state.finish('helper',{ikemen:true,moveType:'A'});assert.equal(state.cost('helper'),3);
state.finish('helper',{ikemen:true,moveType:'I'});assert.equal(state.cost('helper'),0);
assert.equal(state.sampleFall('helper',1,false),false);assert.equal(state.sampleFall('helper',1,true),false);assert.equal(state.sampleFall('helper',2,true),true);
const snapshot=state.snapshot();state.clear();state.restore(snapshot);assert.deepEqual(state.snapshot(),snapshot);state.delete('helper');assert.equal(state.cost('helper'),0);
console.log('Native juggle budget ownership, player/projectile version gates, inheritance, conditional debit, cost reset and previous-fall sampling passed');
for(const value of [NaN,undefined,'7','Moon']){
 let observed=5,reads=0;
 applyStateDefJuggle({juggle:'typed'},{evaluate:()=>{reads++;return value},setCost:value=>{observed=value}});
 assert.equal(observed,0);assert.equal(reads,1);
}
