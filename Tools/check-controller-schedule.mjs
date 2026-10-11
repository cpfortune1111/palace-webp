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
