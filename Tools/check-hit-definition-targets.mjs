import assert from 'node:assert/strict';
import {createHitDefinitionTargets} from '../Engine/hit-definition-targets.js';

const targets=createHitDefinitionTargets(),first={attr:'S, NA'},next={...first};
targets.record(first,'root1',2);
assert.equal(targets.has(first,'root1',2),true);
assert.equal(targets.has(next,'root1',2),false);
assert.equal(targets.has(first,'root2',2),false);
targets.record(first,'helper1',10);
assert.equal(targets.has(first,'helper1',10),true);
assert.equal(targets.has(first,'root1',10),false);
targets.clear();assert.equal(targets.has(first,'root1',2),false);
console.log('HitDef target identity distinguishes activation objects, actor owners and helper instance IDs');
