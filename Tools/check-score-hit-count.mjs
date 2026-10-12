import assert from 'node:assert/strict';
import {createScoreRuntime} from '../Engine/score-runtime.js';

const score=createScoreRuntime(),defender={moveType:'I'},result={guarded:false,getHit:{damage:0}};
score.hit(1,defender,{attr:'S,NA',numhits:3},result);
assert.deepEqual(score.snapshot().hits,[3,0]);
score.hit(1,defender,{attr:'S,NA',numhits:5},{...result,guarded:true});
assert.deepEqual(score.snapshot().hits,[3,0]);
score.hit(2,defender,{attr:'S,NA',numhits:0},result);
assert.deepEqual(score.snapshot().hits,[3,0]);
score.hit(2,defender,{attr:'S,NA'},result);
assert.deepEqual(score.snapshot().hits,[3,1]);
console.log('Match-report hit totals honor explicit numhits, guards, zero and default contacts');
