import assert from 'node:assert/strict';
import {compileHitStateParameters} from '../Engine/hit-state-parameters.js';

assert.deepEqual(compileHitStateParameters({}),{});
assert.deepEqual(compileHitStateParameters({p2stateno:5000}),{p2stateno:5000,p2getp1state:1});
assert.deepEqual(compileHitStateParameters({p2stateno:-1}),{p2stateno:-1,p2getp1state:1});
assert.deepEqual(compileHitStateParameters({p2stateno:5000,p2getp1state:0}),{p2stateno:5000,p2getp1state:0});
assert.deepEqual(compileHitStateParameters({p2getp1state:-1}),{p2getp1state:1});
const calls=[];
assert.deepEqual(compileHitStateParameters({p1stateno:'source',p2stateno:'target',p2getp1state:'own'},{evaluate:value=>{calls.push(value);return {source:100.9,target:2147483648,own:0}[value]}}),{p1stateno:100,p2stateno:-2147483648,p2getp1state:0});
assert.deepEqual(calls,['source','target','own']);
console.log('Native HitDef state-parameter integer/boolean compilation and p2stateno implicit source ownership pass; full state execution remains pending');
