import assert from 'node:assert/strict';
import {excludesHit} from '../Engine/hit-attribute-mask.js';

assert.equal(excludesHit('SCA','A, SP'),true);
assert.equal(excludesHit(',AA,AT','S, NA'),true);
assert.equal(excludesHit(',AA,AT','A, HT'),true);
assert.equal(excludesHit(',AA,AT','S, HP'),false);
assert.equal(excludesHit(',NT,ST,HT','C, NT'),true);
assert.equal(excludesHit(',NT,ST,HT','C, SA'),false);
assert.equal(excludesHit('S, SP','A, SP'),false);
assert.equal(excludesHit('S, SP','S, NP'),false);
console.log('NotHitBy attribute masks passed');
