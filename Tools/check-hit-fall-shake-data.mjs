import assert from 'node:assert/strict';
import {hitFallShakeData} from '../Engine/hit-fall-shake-data.js';
const values=hitFallShakeData({'fall.envshake.ampl':7.9,'fall.envshake.freq':-9,'fall.envshake.phase':270},0.5);
assert.equal(values['fall.envshake.ampl'],3);assert.equal(values['fall.envshake.freq'],0);assert.equal(values['fall.envshake.phase'],270);
assert.ok(Number.isNaN(hitFallShakeData({})['fall.envshake.phase']));
assert.equal('fall.envshake.diradd' in values,false);assert.equal('fall.envshake.decay' in values,false);
const documented=hitFallShakeData({'fall.envshake.diradd':30,'fall.envshake.decay':2},1,{copyExtended:true});
assert.equal(documented['fall.envshake.diradd'],30);assert.equal(documented['fall.envshake.decay'],2);
console.log('Pinned HitDef fall shake default phase, unclamped phase, frequency clamp and recipient amplitude truncation passed');
