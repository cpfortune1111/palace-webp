import assert from 'node:assert/strict';
import {createHitOverrides,applyHitOverrideController,selectHitOverride,tickHitOverrides,hitFlagMask} from '../Engine/hit-override.js';

const root={slots:createHitOverrides()},other={slots:createHitOverrides()},api={evaluate:Number,findActor:id=>id===2?other:null,slots:actor=>actor.slots};
assert.equal(hitFlagMask('D'),8);assert.equal(hitFlagMask('F'),16);assert.throws(()=>hitFlagMask('Q'),/Invalid guard flag/);
applyHitOverrideController({type:'HitOverride',params:{redirectid:2,attr:'SCA,AA',slot:99,time:0,stateno:700,forceair:1,guardflag:'M'}},root,api);
assert.equal(other.slots[0].time,1);assert.equal(other.slots[0].forceAir,true);assert.equal(root.slots[0],null);
assert.equal(selectHitOverride(other.slots,{attr:'A,NA',guardflag:'H'},{attackerState:'S'}).index,0);
assert.equal(selectHitOverride(other.slots,{attr:'S,NA',guardflag:'A'},{attackerState:'S'}),null);
assert.equal(selectHitOverride(other.slots,{attr:'S,NA',guardflag:'H',p2stateno:600},{attackerState:'S'}).miss,true);
assert.equal(selectHitOverride(other.slots,{attr:'S,NA',guardflag:'H',p2stateno:600},{attackerState:'A',projectile:true}).miss,false);
assert.equal(selectHitOverride(other.slots,{attr:'S,NA',guardflag:'H',p1stateno:600},{attackerState:'S'}).miss,true);
assert.equal(selectHitOverride(other.slots,{attr:'S,NA',guardflag:'H',missonoverride:1},{attackerState:'S'}).miss,true);
assert.equal(selectHitOverride(other.slots,{attr:'S,NA',guardflag:'H',p2stateno:600,missonoverride:0},{attackerState:'S'}).miss,false);
tickHitOverrides(other.slots);assert.equal(other.slots[0],null);
applyHitOverrideController({type:'HitOverride',params:{attr:'S,AA',time:-1,keepstate:1}},root,api);tickHitOverrides(root.slots);assert.equal(root.slots[0].time,-1);
console.log('HitOverride slots/default time, redirection, guard masks, miss rules and permanent expiry policy passed');
