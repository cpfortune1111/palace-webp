import assert from 'node:assert/strict';
import {applyStateDefPriority,applyStateDefControlPower} from '../Engine/state-def-scalars.js';

const events=[],state={priority:7,ctrl:0,power:100,anim:0},api={evaluate:expression=>{events.push('eval:'+expression);if(expression==='priority')return 3.9;if(expression==='new anim')return state.anim===11;if(expression==='new ctrl')return state.ctrl?110:0;return Number(expression)},setPriority:value=>{events.push('priority');state.priority=value},setControl:value=>{events.push('ctrl');state.ctrl=Number(value)},addPower:value=>{events.push('power');state.power+=value}};
assert.equal(applyStateDefPriority({},api),false);
applyStateDefControlPower({},api);
assert.deepEqual(state,{priority:7,ctrl:0,power:100,anim:0});
assert.equal(applyStateDefPriority({sprpriority:'priority'},api),true);
assert.equal(state.priority,3);
state.anim=11;applyStateDefControlPower({ctrl:'new anim',poweradd:'new ctrl'},api);
assert.deepEqual([state.ctrl,state.power],[1,210]);
assert.deepEqual(events,['eval:priority','priority','eval:new anim','ctrl','eval:new ctrl','power']);
events.length=0;applyStateDefControlPower({ctrl:0,poweradd:0},api);
assert.deepEqual([state.ctrl,state.power],[0,210]);
assert.deepEqual(events,['eval:0','ctrl','eval:0']);
applyStateDefControlPower({ctrl:-2,poweradd:-4.9},api);
assert.deepEqual([state.ctrl,state.power],[1,206]);
console.log('StateDef scalar fields evaluate once, retain absence, preserve integer/boolean types and apply control before power without zero callbacks');
const layerEvents=[];
applyStateDefPriority({sprpriority:'4'},{evaluate:value=>{layerEvents.push('evaluate');return Number(value)},setPriority:value=>layerEvents.push(['priority',value]),setLayer:value=>layerEvents.push(['layer',value])});
assert.deepEqual(layerEvents,['evaluate',['priority',4],['layer',0]]);
for(const value of [NaN,undefined,'1','-7','Moon']){
 const result={ctrl:true,power:100,priority:5},reads=[];
 const typedApi={evaluate:expression=>{reads.push(expression);return value},setControl:value=>{result.ctrl=value},addPower:value=>{result.power+=value},setPriority:value=>{result.priority=value}};
 applyStateDefPriority({sprpriority:'typed'},typedApi);
 applyStateDefControlPower({ctrl:'typed',poweradd:'typed'},typedApi);
 assert.deepEqual(result,{ctrl:false,power:100,priority:0});
 assert.deepEqual(reads,['typed','typed','typed']);
}
