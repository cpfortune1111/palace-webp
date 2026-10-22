import assert from 'node:assert/strict';
import {createControllerSchedule,createActorControllerSchedules} from '../Engine/controller-schedule.js';

for(const [persistent,expected] of [[1,[0,1,2,3,4,5]],[2,[0,2,4]],[3,[0,3]],[0,[0]],[-1,[0]],[129,[0,1,2,3,4,5]]]){
 const schedule=createControllerSchedule(),executions=[];
 for(let tick=0;tick<6;tick++)if(schedule.before(0,{persistent})){executions.push(tick);schedule.executed(0,{persistent})}
 assert.deepEqual(executions,expected);
 schedule.reset();assert.equal(schedule.before(0,{persistent}),true);
}
const schedule=createControllerSchedule();
assert.equal(schedule.before(0,{persistent:2}),true);schedule.executed(0,{persistent:2});
assert.equal(schedule.before(0,{persistent:2},{hitPause:true}),false);
assert.equal(schedule.before(0,{persistent:2}),false);
assert.equal(schedule.before(0,{persistent:2}),true);
schedule.executed(0,{persistent:2});
assert.equal(schedule.before(0,{persistent:2,ignorehitpause:1},{hitPause:true}),false);
assert.equal(schedule.before(0,{persistent:2,ignorehitpause:1},{hitPause:true}),true);
const conditional=createControllerSchedule();
assert.equal(conditional.before(0,{persistent:3}),true);
assert.equal(conditional.before(0,{persistent:3}),true);
conditional.executed(0,{persistent:3});
assert.equal(conditional.before(0,{persistent:3}),false);
assert.equal(conditional.before(1,{persistent:3}),true);
console.log('Controller persistence, conditional triggers, independent counters and hitpause scheduling passed');
const actors=createActorControllerSchedules(),controller={source:{file:'test.cns',line:12},params:{persistent:'0'}};
let execution=actors.prepare(1,1,controller);assert.equal(execution.eligible,true);execution.executed();
assert.equal(actors.prepare(1,1,{...controller}).eligible,false);
assert.equal(actors.prepare(2,1,controller).eligible,true);
assert.equal(actors.prepare(1,2,controller).eligible,true);
for(let tick=0;tick<4;tick++){
 execution=actors.prepare(1,2,controller,{global:true});assert.equal(execution.eligible,true);execution.executed();
}
assert.equal(actors.prepare(1,2,controller,{global:true,hitPause:true}).eligible,false);
actors.reset();assert.equal(actors.prepare(1,1,controller).eligible,true);
console.log('Actor/state ownership, cloned source identity, negative states and round reset passed');
for(const stateNo of [-1,-2,-3]){
 const negative={...controller,controllerStateNo:stateNo};
 for(let tick=0;tick<3;tick++){const visit=actors.prepare(1,1,negative,{global:negative.controllerStateNo<0});assert.equal(visit.eligible,true);visit.executed()}
}
console.log('All MUGEN negative state origins ignore persistent counters');

for(const player of [1,2]){
 const schedules=createActorControllerSchedules();
 const oldBody=schedules.capture(player,10);
 const oldVisit=oldBody.prepare(controller);
 assert.equal(oldVisit.eligible,true);oldVisit.executed();
 const newBody=schedules.capture(player,11);
 const newVisit=newBody.prepare(controller);
 assert.equal(newVisit.eligible,true);newVisit.executed();
 assert.equal(oldBody.prepare({...controller}).eligible,false);
 assert.equal(newBody.prepare({...controller}).eligible,false);
 assert.equal(schedules.prepare(player,11,controller).eligible,false);
 const tail={source:{file:'test.cns',line:13},params:{persistent:'2'}};
 const tailVisit=oldBody.prepare(tail);
 assert.equal(tailVisit.eligible,true);tailVisit.executed();
 assert.equal(oldBody.prepare(tail).eligible,false);
 assert.equal(oldBody.prepare(tail,{hitPause:true}).eligible,false);
 assert.equal(oldBody.prepare(tail).eligible,true);
 assert.equal(newBody.prepare(tail).eligible,true);
 assert.equal(oldBody.prepare(controller,{global:true}).eligible,true);
 assert.equal(schedules.prepare(player,99,controller,{global:true}).eligible,true);
 assert.equal(schedules.prepare(player,11,controller).eligible,false);
}
console.log('Captured old-body schedules survive nested entries without replacing current-body counters');
for(const [literal,expected] of [['2 + 5',[0,2,4]],['var(8)',[0]],['0.5',[0]],['2147483648',[0,1,2,3,4,5]]]){
 const schedule=createControllerSchedule(),executions=[];
 for(let tick=0;tick<6;tick++)if(schedule.before(0,{persistent:literal})){executions.push(tick);schedule.executed(0,{persistent:literal});}
 assert.deepEqual(executions,expected,literal);
}
for(const [literal,expected] of [['1 + 0',true],['0.5',false],['-0.9',false],['var(8)',false]]){
 assert.equal(createControllerSchedule().before(0,{ignorehitpause:literal},{hitPause:true}),expected,literal);
 assert.equal(createActorControllerSchedules().prepare(1,1,{params:{ignorehitpause:literal}},{global:true,hitPause:true}).eligible,expected,literal);
}

