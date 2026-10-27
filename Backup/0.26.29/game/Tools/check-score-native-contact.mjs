import assert from 'node:assert/strict';
import {createScoreRuntime} from '../Engine/score-runtime.js';
import {getHitScalar} from '../Engine/get-hit-scalar.js';

const scores=createScoreRuntime(),defender={moveType:'I'},result={guarded:false,getHit:{damage:10}};
scores.hit(1,defender,{attr:'S,NA',score:'12.5,3.25'},result);
assert.equal(getHitScalar(result.getHit,'score').value,12.5);
assert.deepEqual(scores.snapshot().roundScores,[1512.5,3.25]);
scores.hit(1,defender,{attr:'S,NA',score:'20,30'},{guarded:true,getHit:{damage:1}});
assert.deepEqual(scores.snapshot().roundScores,[1512.5,3.25]);
scores.hit(1,defender,{attr:'S,NA',score:'7,8'},{sourceScoreExcluded:true,targetPlayerType:false,getHit:{damage:10}});
assert.deepEqual(scores.snapshot().roundScores,[1512.5,3.25]);
assert.equal(getHitScalar({},'score').value,0);
scores.hit(1,defender,{attr:'S,NA',score:'100,200'},{nativeScoreApplied:true,getHit:{damage:10}});
assert.deepEqual(scores.snapshot().roundScores,[1512.5,3.25]);
console.log('Game score runtime routes explicit native score gates/query values while preserving existing first-hit bonus');
