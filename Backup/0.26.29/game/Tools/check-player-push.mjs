import assert from 'node:assert/strict';
import {createPlayerPushState,applyPlayerPushController,playerPushShares} from '../Engine/player-push.js';
const actor={push:createPlayerPushState()},api={evaluate:Number,findActor:id=>id===2?actor:null,state:owner=>owner.push};
applyPlayerPushController({type:'PlayerPush',params:{redirectid:2,priority:4,affectteam:'Both'}},{},api);assert.deepEqual(actor.push,{enabled:true,priority:4,affectTeam:0});
assert.deepEqual(playerPushShares(actor.push,createPlayerPushState()),[0,1]);
assert.deepEqual(playerPushShares(createPlayerPushState(),createPlayerPushState()),[0.5,0.5]);
assert.equal(playerPushShares(createPlayerPushState(),createPlayerPushState(),true),null);
assert.deepEqual(playerPushShares(actor.push,createPlayerPushState(),true),[0,1]);
applyPlayerPushController({type:'PlayerPush',params:{affectteam:'Friend'}},actor,api);assert.equal(playerPushShares(actor.push,createPlayerPushState()),null);
assert.throws(()=>applyPlayerPushController({type:'PlayerPush',params:{}},actor,api),/at least/);
assert.throws(()=>applyPlayerPushController({type:'PlayerPush',params:{affectteam:'wrong'}},actor,api),/Invalid/);
console.log('PlayerPush redirection, team masks, priorities and native validation passed');

