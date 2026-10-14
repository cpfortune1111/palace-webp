import assert from 'node:assert/strict';
import {getHitWriteEligible} from '../Engine/get-hit-write-eligibility.js';

for(const gettingHit of [false,true])for(const stateChangePending of [false,true])for(const customStateApplied of [false,true])assert.equal(getHitWriteEligible({gettingHit,stateChangePending,customStateApplied}),!(gettingHit&&stateChangePending&&!customStateApplied));
assert.throws(()=>getHitWriteEligible({gettingHit:true}),/phase input/);
console.log('Pinned same-pass GetHitVar write eligibility truth table passes; authoritative live state-change-pending export is still required');
