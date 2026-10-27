import assert from 'node:assert/strict';
import {getHitAttributeString,getHitAttributeMatches} from '../Engine/get-hit-attribute.js';
assert.equal(getHitAttributeString(65),'S, NA');
assert.equal(getHitAttributeString(0),'');
assert.equal(getHitAttributeString(1|4|64|512),'SA, NA, SA');
assert.equal(getHitAttributeMatches('S, NA','SCA, AA'),true);
assert.equal(getHitAttributeMatches('S, NA','C, AA'),false);
assert.equal(getHitAttributeMatches('S, NA','S, NT'),false);
console.log('GetHitVar attr native string rendering and independent state/attack mask intersection passed');
