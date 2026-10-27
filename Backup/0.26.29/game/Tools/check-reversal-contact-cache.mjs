import assert from 'node:assert/strict';
import {createReversalContactCache} from '../Engine/reversal-contact-cache.js';

const cache=createReversalContactCache(),source={},target={};
cache.begin(1);assert.equal(cache.get(source,target,'source','target'),undefined);
cache.set(source,target,'source','target',false);
assert.equal(cache.get(source,target,'source','target'),false);
assert.equal(cache.get(target,source,'target','source'),undefined);
assert.equal(cache.get(source,{},'source','target'),undefined);
assert.equal(cache.get(source,target,'other','target'),undefined);
assert.equal(cache.get(source,target,'source','other'),undefined);
cache.begin(1);assert.equal(cache.get(source,target,'source','target'),false);
cache.begin(2);assert.equal(cache.get(source,target,'source','target'),undefined);
cache.set(source,target,'source','target',true);assert.equal(cache.get(source,target,'source','target'),true);
assert.throws(()=>cache.set(source,target,'source','target',1),/decision/);
cache.clear();assert.equal(cache.get(source,target,'source','target'),undefined);
console.log('Reversal contact cache separates actor/definition identity, reciprocal direction, false decisions and collision ticks');
