import assert from 'node:assert/strict';
import {hitPauseVersionProfile} from '../Engine/hit-pause-version.js';
import {reversalHitPause} from '../Engine/reversal-hit-pause.js';

const profile=(mugen,ikemen)=>hitPauseVersionProfile({engineVersions:{mugen,ikemen}});
assert.deepEqual(profile([1,0],[0,0,0]),{mugenMajor:1,ikemen:false});
assert.deepEqual(profile([0,5],[0,0,1]),{mugenMajor:0,ikemen:false});
assert.deepEqual(profile([1,1],[0,99,1]),{mugenMajor:1,ikemen:true});
assert.equal(reversalHitPause('2,3',profile([0,5],[0,0,0])).source,2);
assert.equal(reversalHitPause('2,3',profile([1,0],[0,0,0])).source,3);
assert.throws(()=>hitPauseVersionProfile({compatibility:'mugen'}),/Missing native/);
assert.throws(()=>profile([65536,0],[0,0]),/Invalid native/);
console.log('Source hitpause reads imported native version arrays without treating Ikemen patch-only metadata or compatibility labels as version evidence');
