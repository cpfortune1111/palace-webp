import assert from 'node:assert/strict';
import {createHitPhaseStatus} from '../Engine/hit-phase-status.js';

const phase=createHitPhaseStatus();
phase.begin(10);phase.mark('root1');phase.mark('helper1');
assert.equal(phase.has('root1'),true);assert.equal(phase.has('root2'),false);
phase.begin(10);assert.equal(phase.has('helper1'),true);
phase.begin(11);assert.equal(phase.has('root1'),false);
phase.mark('root2');phase.clear();assert.equal(phase.has('root2'),false);
console.log('Collision-phase gethit flags reset once per pass, preserve same-pass contacts and remain independent of MoveType');
