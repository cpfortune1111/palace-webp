import assert from 'node:assert/strict';
import {createActorControllerSchedules} from '../Engine/controller-schedule.js';

const schedules=createActorControllerSchedules();
const controller=(slot,file='old.cns',persistent=0)=>({controllerSchedulingIndex:slot,source:{file,line:slot+1},params:{persistent,ignorehitpause:1}});
const lock=schedules.prepare(1,10,controller(0));
assert.equal(lock.eligible,true);lock.executed();
const wait=schedules.prepare(1,10,controller(1,'old.cns',3));
assert.equal(wait.eligible,true);wait.executed();
schedules.prepare(1,10,controller(2));
schedules.carryTo(1,10,11);
assert.equal(schedules.prepare(1,11,controller(0,'new.cns'),{hitPause:true}).eligible,false,'locked CNS slot survives a change of source file');
assert.equal(schedules.prepare(1,11,controller(1,'new.cns',3),{hitPause:true}).eligible,false);
assert.equal(schedules.prepare(1,11,controller(1,'new.cns',3),{hitPause:true}).eligible,false);
assert.equal(schedules.prepare(1,11,controller(1,'new.cns',3),{hitPause:true}).eligible,true,'countdown is carried');
assert.equal(schedules.prepare(1,11,controller(2,'new.cns'),{hitPause:true}).eligible,false,'transition slot is skipped even with ignorehitpause');
assert.equal(schedules.prepare(2,11,controller(0),{hitPause:true}).eligible,true,'recipient counters are independent');
assert.equal(schedules.releaseCarry(1,10),false,'stale generation cannot clear current counters');
assert.equal(schedules.releaseCarry(1,11),true);
assert.equal(schedules.prepare(1,11,controller(0,'new.cns')).eligible,true,'release clears carried locks');
assert.equal(schedules.prepare(1,11,controller(2,'new.cns')).eligible,true,'release clears skipped slot');
assert.equal(schedules.releaseCarry(1,11),false);
console.log('CNS-slot carry, transition-slot suppression, release and actor isolation passed');

const resized=createActorControllerSchedules();
for(const slot of [0,5]){const item=resized.prepare(1,1,controller(slot));assert.equal(item.eligible,true);item.executed()}
resized.carryTo(1,1,2,1);
assert.equal(resized.releaseCarry(1,2),true);
assert.equal(resized.prepare(1,2,controller(0)).eligible,true,'short destination resets its visible counter');
resized.visit(1,2,0);resized.carryTo(1,2,3,6);
assert.equal(resized.prepare(1,3,controller(5),{hitPause:true}).eligible,false,'hidden capacity retains a locked counter after short-state release');
resized.releaseCarry(1,3);
assert.equal(resized.prepare(1,3,controller(5)).eligible,true,'expanded destination resets the recovered slot on release');
console.log('Short-state visible reset preserves recovered CNS-slot history');

const ordinary=createActorControllerSchedules(),captured=ordinary.capture(1,1);
for(const slot of [0,5]){const item=captured.prepare(controller(slot));item.executed()}
ordinary.selectTo(1,1,2,1);
assert.equal(ordinary.prepare(1,2,controller(0)).eligible,true,'ordinary selection resets visible destination slots');
assert.equal(captured.prepare(controller(0)).eligible,true,'captured source sees reused visible backing reset');
ordinary.visit(1,2,0);ordinary.carryTo(1,2,3,6);
assert.equal(ordinary.prepare(1,3,controller(5),{hitPause:true}).eligible,false,'ordinary short entry retains hidden backing');
ordinary.selectTo(1,3,4,6);
assert.equal(ordinary.prepare(1,4,controller(5)).eligible,true,'ordinary long entry clears recovered visible slot');
console.log('Ordinary selection resets visible positions while retaining hidden backing');
const unindexed={source:{file:'direct-runtime-fixture',line:1},params:{persistent:0}};
const direct=ordinary.prepare(1,4,unindexed);direct.executed();
assert.equal(ordinary.prepare(1,4,unindexed).eligible,false);
ordinary.selectTo(1,4,5,1);
assert.equal(ordinary.prepare(1,5,unindexed).eligible,true,'unindexed direct runtime controllers reset on ordinary selection');

const nested=createActorControllerSchedules(),sourceBody=nested.capture(1,1);
sourceBody.prepare(controller(0));nested.selectTo(1,1,2,4);
sourceBody.prepare(controller(2));nested.carryTo(1,2,3,4);
assert.equal(nested.prepare(1,3,controller(2),{hitPause:true}).eligible,false,'continued old body updates actor-wide current slot before the next transition');
assert.equal(nested.prepare(1,3,controller(0),{hitPause:true}).eligible,true,'second transition does not skip the earlier slot');
console.log('Continued source body retains actor-wide current-controller position');

const negative=createActorControllerSchedules(),globalController=controller(1);
for(let visit=0;visit<2;visit++){const item=negative.prepare(1,10,globalController,{global:true,hitPause:true});assert.equal(item.eligible,true);item.executed()}
negative.carryTo(1,10,11,3);
assert.equal(negative.prepare(1,11,controller(1),{global:true,hitPause:true}).eligible,false,'negative body also honors MUGEN transition-slot suppression');
assert.equal(negative.prepare(1,11,controller(0),{global:true,hitPause:true}).eligible,true);
negative.releaseCarry(1,11);
assert.equal(negative.prepare(1,11,controller(1),{global:true,hitPause:true}).eligible,true);
console.log('Negative states bypass persistent counters while tracking and suppressing CNS slots');
