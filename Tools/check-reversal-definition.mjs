import assert from 'node:assert/strict';
import {prepareReversalDefinition} from '../Engine/reversal-definition.js';
import {hitDefCollisionBoxes} from '../Engine/hitdef-collision-group.js';

assert.throws(()=>prepareReversalDefinition({}),/reversal.attr not specified/);
assert.throws(()=>prepareReversalDefinition({'reversal.attr':'Q, NA'}),/Invalid attr/);
const result=prepareReversalDefinition({'reversal.attr':'SCA, NA, SA',damage:'20,0'});
assert.equal(result.reversalMask,7|64|512);
assert.equal(result.p2clsncheck,'clsn1');
assert.equal(result.damage,'20,0');
assert.equal(prepareReversalDefinition({'reversal.attr':'S, NA',p2clsncheck:'clsn2'}).p2clsncheck,'clsn2');
assert.throws(()=>prepareReversalDefinition({'reversal.attr':'S, NA',p2clsncheck:'caller'}),/Invalid Clsn/);
const sets={c1:[[0,0,10,10]],c2:[[20,20,30,30]]};
assert.equal(hitDefCollisionBoxes(result,sets).boxes,sets.c1);
console.log('Reversal definition enforces required attributes, preserves shared HitDef parameters and defaults recipient collision to attack boxes');
