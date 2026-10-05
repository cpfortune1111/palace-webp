import assert from 'node:assert/strict';
import {effectPulse,particleLanding} from '../Stage/Select/select-effects-timing.js';
assert.equal(effectPulse(0,0),0);assert.equal(effectPulse(6,0),1);assert.equal(effectPulse(42,0),0);
for(let tick=42;tick<132;tick++)assert.equal(effectPulse(tick,0),0);
for(const kind of ['beam','star'])for(let index=0;index<7;index++){let zeros=0;for(let tick=0;tick<1200;tick++){const value=effectPulse(tick,index,kind);assert.ok(value>=0&&value<=1);if(value===0)zeros++}assert.ok(zeros>0)}
assert.equal(effectPulse(4,0,'star'),1);assert.equal(effectPulse(12,0,'star'),0);
for(const phase of [.82,.9,.99])assert.equal(particleLanding(phase,1).coreScale,1);
assert.equal(particleLanding(.82,1).progress,particleLanding(.99,1).progress);
assert.ok(particleLanding(.9,0).coreScale>1);assert.ok(particleLanding(.9,1).haloScale>2.4);assert.equal(particleLanding(1,1).fade,0);
console.log('Fast-rise/slow-fade, transparent >=90-tick random holds, quick star pulses and stationary landing passed');
