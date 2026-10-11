import assert from 'node:assert/strict';
import {createControllerSchedule} from '../Engine/controller-schedule.js';

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
