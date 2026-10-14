import assert from 'node:assert/strict';
import {hitPauseParameters} from '../Engine/hit-pause-parameters.js';

assert.deepEqual(hitPauseParameters({}),{pause:[0,0],guard:[0,0]});
assert.deepEqual(hitPauseParameters({pausetime:'4,7','guard.pausetime':'2'}),{pause:[4,7],guard:[2,7]});
assert.deepEqual(hitPauseParameters({pausetime:'4'}),{pause:[4,0],guard:[4,0]});
assert.deepEqual(hitPauseParameters({pausetime:'4,7','guard.pausetime':'-2147483648,0'}),{pause:[4,7],guard:[4,0]});
const reads=[];
assert.deepEqual(hitPauseParameters({pausetime:'first,second','guard.pausetime':'third'},{evaluate:value=>{reads.push(value);return reads.length+0.75}}),{pause:[1,2],guard:[3,2]});
assert.deepEqual(reads,['first','second','third']);
assert.throws(()=>hitPauseParameters({pausetime:'1,2,3'}),/component count/);
console.log('Native integer hitpause compilation preserves per-component guard inheritance, explicit zero, sentinel fallback and single evaluation');
