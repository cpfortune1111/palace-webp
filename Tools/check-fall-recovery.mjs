import assert from 'node:assert/strict';
import {fallRecoveryParameters,canRecover,advanceFallRecovery} from '../Engine/fall-recovery.js';

const getHit={...fallRecoveryParameters({}),fall:1};
assert.equal(canRecover(getHit),false);
advanceFallRecovery(getHit,'H',true);assert.equal(getHit['fall.time'],0);
advanceFallRecovery(getHit,'I',false);assert.equal(getHit['fall.time'],0);
for(let tick=0;tick<3;tick++)advanceFallRecovery(getHit,'H',false);
assert.equal(canRecover(getHit),false);
advanceFallRecovery(getHit,'H',false);assert.equal(canRecover(getHit),true);
getHit['fall.recover']=false;assert.equal(canRecover(getHit),false);
assert.equal(canRecover(fallRecoveryParameters({'fall.recovertime':0})),true);
assert.equal(fallRecoveryParameters({'fall.recover':0.5})['fall.recover'],true);
console.log('Native recover defaults, threshold, flag and fall-clock pause predicates passed');
