import assert from 'node:assert/strict';
import {hitContactPhaseAllowed} from '../Engine/hit-contact-phase.js';
import {compileAttackAttribute} from '../Engine/attack-attribute.js';
import {createHitPhaseStatus} from '../Engine/hit-phase-status.js';

for(const sourceGettingHit of [false,true])for(const targetGettingHit of [false,true])for(const p1stateno of [undefined,-1,0,801])for(const targetAttribute of [undefined,0,'S,NA','A,NT','C,ST','S,HT','SCA,AT','S,NP','C,SP','A,HP','S,NA,HT']){
 const mask=typeof targetAttribute==='string'?compileAttackAttribute(targetAttribute):targetAttribute??0;
 const expected=!(sourceGettingHit&&p1stateno>=0)&&!(targetGettingHit&&!!(mask&9344));
 assert.equal(hitContactPhaseAllowed({p1stateno},{sourceGettingHit,targetGettingHit,targetAttribute}),expected);
 assert.equal(hitContactPhaseAllowed({p1stateno},{sourceGettingHit,targetGettingHit,targetAttribute:mask}),expected);
}
assert.throws(()=>hitContactPhaseAllowed({}),/phase input/);
assert.throws(()=>hitContactPhaseAllowed({},{sourceGettingHit:false,targetGettingHit:0}),/phase input/);
const phase=createHitPhaseStatus();
phase.begin(5);phase.mark('victim');
assert.equal(hitContactPhaseAllowed({},{sourceGettingHit:phase.has('source'),targetGettingHit:phase.has('victim'),targetAttribute:'S,NT'}),false);
phase.begin(5);
assert.equal(hitContactPhaseAllowed({p1stateno:0},{sourceGettingHit:phase.has('victim'),targetGettingHit:false}),false);
phase.begin(6);
assert.equal(hitContactPhaseAllowed({},{sourceGettingHit:false,targetGettingHit:phase.has('victim'),targetAttribute:'S,NT'}),true);
console.log('Pinned hitResultCheck gethit/throw and P1StateNo-source rejection gates match all phase/attribute combinations; deferred stchtmp/native scheduling remains Pending');
