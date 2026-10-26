import assert from 'node:assert/strict';
import {applyStatePersistence} from '../Engine/state-persistence.js';
import {createSpecialRuntime} from '../Char/Venus/venus-special-runtime.js';

const events=[];
let hits=5;
const api={evaluate:expression=>{events.push(expression);return expression==='hitcount'?hits:Number(expression)},clearHitCount:()=>{events.push('clearHitCount');hits=0},clearMoveHit:()=>events.push('clearMoveHit'),clearHitDef:()=>events.push('clearHitDef')};
assert.deepEqual(applyStatePersistence({},api),{hitcountpersist:0,movehitpersist:0,hitdefpersist:0});
assert.deepEqual(events,['clearHitCount','clearMoveHit','clearHitDef']);
events.length=0;hits=5;
assert.deepEqual(applyStatePersistence({hitcountpersist:'0',movehitpersist:'hitcount',hitdefpersist:'-2'},api),{hitcountpersist:0,movehitpersist:0,hitdefpersist:1});
assert.deepEqual(events,['0','clearHitCount','hitcount','clearMoveHit','-2']);
events.length=0;
assert.deepEqual(applyStatePersistence({hitcountpersist:'1',movehitpersist:'2',hitdefpersist:'0'},api),{hitcountpersist:1,movehitpersist:1,hitdefpersist:0});
assert.deepEqual(events,['1','2','0','clearHitDef']);
console.log('StateDef persistence evaluates expressions and invokes resets sequentially in native order');
const definition={type:'A',moveType:'A',physics:'N',ctrl:1,hitcountpersist:'entry',movehitpersist:'hitcount',hitdefpersist:'0'};
const helper={kind:'helper',key:'fixture',player:1,state:100,time:12,type:'S',moveType:'I',physics:'S',ctrl:0,hitCount:3,guardCount:2,moveContact:4,moveHit:4,moveGuarded:0,activeHitDef:{id:1},guardHitDef:{id:2}};
const transitions=[];
const runtime=createSpecialRuntime({data:()=>({helperStates:{200:definition}}),root:()=>({vars:[]}),context:entity=>({...entity}),effects:[],eval:(value,context)=>value==='entry'?Number(context.state===200&&context.time===0&&context.type==='A'&&context.moveType==='A'&&context.ctrl===0):value==='hitcount'?context.hitCount:Number(value),transitionMoveContact:(actor,flags)=>transitions.push({...flags})});
runtime.enterState(helper,200);
assert.deepEqual([helper.prevState,helper.state,helper.time,helper.hitCount,helper.guardCount,helper.moveContact,helper.moveHit,helper.ctrl],[100,200,0,3,2,4,4,1]);
assert.equal(helper.activeHitDef,null);
assert.equal(helper.guardHitDef,null);
assert.deepEqual(transitions,[]);
definition.hitcountpersist='0';definition.movehitpersist='hitcount';definition.hitdefpersist='1';helper.activeHitDef={id:3};helper.guardHitDef={id:4};
runtime.enterState(helper,200);
assert.deepEqual([helper.hitCount,helper.guardCount,helper.moveContact,helper.moveHit],[0,0,0,0]);
assert.deepEqual([helper.activeHitDef.id,helper.guardHitDef.id],[3,4]);
assert.deepEqual(transitions,[{hitcountpersist:0,movehitpersist:1},{hitcountpersist:1,movehitpersist:0}]);
console.log('Actual Helper enterState honors expression context, ordered resets and retained contact/HitDef consumers');
for(const value of [NaN,undefined,'1','Moon']){
 const resets=[],reads=[];
 assert.deepEqual(applyStatePersistence({hitcountpersist:'typed',movehitpersist:'typed',hitdefpersist:'typed'},{evaluate:field=>{reads.push(field);return value},clearHitCount:()=>resets.push('count'),clearMoveHit:()=>resets.push('move'),clearHitDef:()=>resets.push('definition')}),{hitcountpersist:0,movehitpersist:0,hitdefpersist:0});
 assert.deepEqual(resets,['count','move','definition']);assert.deepEqual(reads,['typed','typed','typed']);
}
