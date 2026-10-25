import assert from 'node:assert/strict';
import {createExplodAnimationClock,modifyExplodAnimationClock,stepExplodAnimationClock} from '../Engine/explod-animation-clock.js';
import {applyModifyExplodController} from '../Engine/modify-explod.js';

const frames=[{time:2},{time:3},{time:1}],clock=createExplodAnimationClock(frames,1),trace=[];
for(let tick=0;tick<12;tick++){stepExplodAnimationClock(clock);trace.push(clock.draw)}
assert.deepEqual(trace,[0,0,1,1,1,2,1,1,1,2,1,1]);assert.equal(clock.loopEnd,true);
modifyExplodAnimationClock(clock,{animelem:2,animelemtime:2,animfreeze:true});assert.equal(clock.draw,1);assert.equal(clock.time,2);assert.equal(clock.loopEnd,false);
for(let tick=0;tick<20;tick++)stepExplodAnimationClock(clock);assert.equal(clock.draw,1);assert.equal(clock.time,2);assert.equal(clock.loopEnd,false);
modifyExplodAnimationClock(clock,{animfreeze:false});stepExplodAnimationClock(clock);assert.equal(clock.draw,1);stepExplodAnimationClock(clock);assert.equal(clock.draw,2);
modifyExplodAnimationClock(clock,{animelem:900,animelemtime:99});assert.equal(clock.draw,0);assert.equal(clock.targetElem,1);assert.equal(clock.targetTime,0);
modifyExplodAnimationClock(clock,{animelem:3,animelemtime:-1});assert.equal(clock.draw,2);assert.equal(clock.targetTime,0);
const held=createExplodAnimationClock([{time:2},{time:-1}],0);modifyExplodAnimationClock(held,{animelem:2,animelemtime:999});assert.equal(held.time,999);for(let tick=0;tick<20;tick++)stepExplodAnimationClock(held);assert.equal(held.draw,1);assert.equal(held.loopEnd,false);
const zero=createExplodAnimationClock([{time:0},{time:2},{time:0},{time:1}],1);modifyExplodAnimationClock(zero,{animelem:1});assert.equal(zero.draw,1);assert.equal(zero.targetElem,1);stepExplodAnimationClock(zero);assert.equal(zero.draw,1);
for(const age of [0,1,2,5,6,7,10,50,10000]){const incremental=createExplodAnimationClock(frames,1);for(let tick=0;tick<age;tick++)stepExplodAnimationClock(incremental);assert.deepEqual(createExplodAnimationClock(frames,1,age),incremental)}
assert.throws(()=>createExplodAnimationClock([{time:-1},{time:2}]),/nonterminal negative/);
assert.throws(()=>createExplodAnimationClock([{time:0},{time:0}]),/all-zero/);
const empty=createExplodAnimationClock([]);assert.equal(empty.loopEnd,false);stepExplodAnimationClock(empty);assert.equal(empty.loopEnd,true);modifyExplodAnimationClock(empty,{animfreeze:true});stepExplodAnimationClock(empty);assert.equal(empty.loopEnd,false);
const owner={},effects=[{},{}],writes=[],order=[];
applyModifyExplodController({type:'ModifyExplod',params:{animelemtime:'4.9',animfreeze:'-1',animelem:'2.9'}},owner,{evaluate:value=>{order.push(value);return Number(value)},split:value=>value.split(','),select:()=>effects,ikemenVersion:()=>false,localScale:()=>1,modify:(effect,actor,changes)=>writes.push(changes)});
assert.deepEqual(order,['2.9','4.9','-1']);assert.deepEqual(writes[0].animationControl,{animelem:2,animelemtime:4,animfreeze:true});assert.equal(writes.length,2);
console.log('Explod animation clock finite loops, element/time validation, terminal holds, zero elements, freeze/resume, age reconstruction and real modifier extraction pass');
