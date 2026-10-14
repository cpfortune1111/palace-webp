import assert from 'node:assert/strict';
import {recordTargetedBy} from '../Engine/hit-targeted-by.js';
import {hitChainAllowed} from '../Engine/hit-chain.js';

const previous=[[1,4],[2,9]],next=recordTargetedBy(previous,1,15);
assert.deepEqual(previous,[[1,4],[2,9]]);
assert.deepEqual(next,[[2,9],[1,4]]);
assert.deepEqual(recordTargetedBy(next,3,15),[[2,9],[1,4],[3,15]]);
assert.equal(hitChainAllowed({nochainid:'7'},{hitid:7,playerid:1},{sourceId:1,lastTargetOwner:next.at(-1)[0]}),false);
assert.equal(hitChainAllowed({nochainid:'7'},{hitid:7,playerid:1},{sourceId:1,lastTargetOwner:previous.at(-1)[0]}),true);
console.log('TargetedBy moves repeated sources to the end while preserving their juggle balance and immutable prior hit data');
