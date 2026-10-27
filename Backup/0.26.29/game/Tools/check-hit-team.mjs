import assert from 'node:assert/strict';
import {compileHitAffectTeam,hitTeamAllowed} from '../Engine/hit-team.js';

assert.equal(compileHitAffectTeam(),1);assert.equal(compileHitAffectTeam('Friendly'),-1);assert.equal(compileHitAffectTeam('Both'),0);
assert.throws(()=>compileHitAffectTeam(''),/affectteam/);
for(const sourceSide of [0,1,2])for(const targetSide of [0,1,2]){
 assert.equal(hitTeamAllowed({},sourceSide,targetSide),sourceSide!==targetSide);
 assert.equal(hitTeamAllowed({affectteam:'F'},sourceSide,targetSide),sourceSide===targetSide);
 assert.equal(hitTeamAllowed({affectteam:'B'},sourceSide,targetSide),true);
}
console.log('HitDef affectteam E/F/B and neutral side equality truth table passes');
