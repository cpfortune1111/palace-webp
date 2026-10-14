import assert from 'node:assert/strict';
import {getHitQueryScale} from '../Engine/get-hit-query-scale.js';
assert.equal(getHitQueryScale({zvel:8},'zvel',0.5).value,4);
assert.equal(getHitQueryScale({'fall.envshake.ampl':-5},'fall.envshake.ampl',0.5).value,-2);
assert.equal(getHitQueryScale({'fall.xvel':null},'fall.xvel',2).value,-32760);
assert.equal(getHitQueryScale({'fall.zvel':NaN},'fall.zvel',2).value,-32760);
assert.equal(getHitQueryScale({damage:7},'damage',2).handled,false);
console.log('GetHitVar recipient-to-expression-origin scaling, amplitude truncation and fall sentinel passed');
