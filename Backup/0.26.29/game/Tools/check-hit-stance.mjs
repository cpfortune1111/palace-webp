import assert from 'node:assert/strict';
import {hitStanceParameters,forcedHitStance} from '../Engine/hit-stance.js';

assert.deepEqual(hitStanceParameters({}),{forcestand:false,forcecrouch:false});
assert.equal(hitStanceParameters({'ground.velocity':'0,-10'}).forcestand,true);
assert.equal(hitStanceParameters({'ground.velocity':'0,-10',forcestand:0}).forcestand,false);
assert.equal(forcedHitStance('C',{forcestand:true,forcecrouch:true}),'S');
assert.equal(forcedHitStance('S',{forcestand:true,forcecrouch:true}),'C');
assert.equal(forcedHitStance('A',{forcestand:true,forcecrouch:true}),'A');
assert.equal(forcedHitStance('L',{forcestand:true,forcecrouch:true}),'L');
console.log('Native explicit/default force-stance flags and source-stance precedence passed');
