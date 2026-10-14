import assert from 'node:assert/strict';
import {combatBaseTrigger} from '../Engine/combat-base-trigger.js';

assert.equal(combatBaseTrigger(120,Math.fround(1.0000001)),120);
assert.equal(combatBaseTrigger(100,1.23456),Math.fround(123.456));
assert.equal(combatBaseTrigger(-1,1.2345),Math.fround(-1.235));
assert.equal(combatBaseTrigger(1,1.2345),Math.fround(1.235));
assert.equal(combatBaseTrigger(0,2),0);
console.log('Pinned attack/defence trigger three-decimal snapping uses half-away rounding and float32 return');
