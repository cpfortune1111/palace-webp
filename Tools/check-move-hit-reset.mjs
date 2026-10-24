import assert from 'node:assert/strict';
import {applyMoveHitResetController} from '../Engine/move-hit-reset.js';
import {clearMoveContact} from '../Engine/move-contact-clock.js';

const caller={clock:{type:'hit',time:7,countered:true},count:11,metadata:{frame:true,playerid:123}},helper={clock:{type:'reversed',time:-1,countered:true},count:13,metadata:{overridden:true}},cleared=[];
const api={evaluate:value=>value,findActor:id=>id===7?helper:null,clear:actor=>{cleared.push(actor);clearMoveContact(actor.clock)}};
assert.equal(applyMoveHitResetController({type:'Null'},caller,api),false);
assert.equal(applyMoveHitResetController({type:'MoveHitReset',params:{}},caller,api),true);
assert.deepEqual(caller.clock,{type:'hit',time:0,countered:false});assert.equal(caller.count,11);assert.deepEqual(caller.metadata,{frame:true,playerid:123});
applyMoveHitResetController({type:'MoveHitReset',params:{redirectid:4294967303}},caller,api);
assert.deepEqual(helper.clock,{type:'reversed',time:0,countered:false});assert.equal(helper.count,13);assert.deepEqual(helper.metadata,{overridden:true});assert.deepEqual(cleared,[caller,helper]);
for(const operand of ['7',undefined,NaN]){
 const ids=[];
 applyMoveHitResetController({type:'MoveHitReset',params:{redirectid:'operand'}},caller,{...api,evaluate:()=>operand,findActor:id=>{ids.push(id);return null},clear:()=>{throw Error('Missing recipient must not clear anything')}});
 assert.deepEqual(ids,[0]);
}
assert.throws(()=>applyMoveHitResetController({type:'MoveHitReset',params:{value:1}},caller,api),/Unsupported MoveHitReset parameter/);
console.log('MoveHitReset dispatch preserves native target extraction and clears contact time/counter flag without resetting counts or metadata');
