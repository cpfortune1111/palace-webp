import assert from 'node:assert/strict';
import {powerTimingProfile} from '../Engine/combat-engine-profile.js';

assert.equal(powerTimingProfile('mugen11'),'mugen');
assert.equal(powerTimingProfile('ikemen'),'ikemen');
assert.throws(()=>powerTimingProfile('character-mugen-1.0'),/Unsupported combat engine/);
console.log('Engine-wide power timing uses an explicit runtime profile, not character DEF compatibility metadata');
