import assert from 'node:assert/strict';
import {compileAttackAttribute,attackAttributeMatches} from '../Engine/attack-attribute.js';

assert.equal(compileAttackAttribute('SCA, NA, HP'),7|64|16384);
assert.equal(compileAttackAttribute('SCA, NA, HP',{hitdef:true}),4|64|16384);
assert.equal(compileAttackAttribute('S,AA,AT,AP'),1|32704);
assert.equal(compileAttackAttribute('S,N'),1|448);
assert.equal(compileAttackAttribute('C,S'),2|3584);
assert.equal(compileAttackAttribute('A,A'),4|28672);
assert.equal(compileAttackAttribute('S,NAoops,HP',{ignoreMostErrors:true}),1|64);
assert.equal(compileAttackAttribute('S?,HP',{ignoreMostErrors:true}),1);
assert.equal(compileAttackAttribute('S,unknown,HP',{ignoreMostErrors:true}),1);
assert.throws(()=>compileAttackAttribute('L,NA'),/Invalid attr/);
assert.throws(()=>compileAttackAttribute('S,NAoops'),/Invalid attr/);
assert.equal(attackAttributeMatches('S,HP','A,NA,HP',{attackerState:'S'}),true);
assert.equal(attackAttributeMatches('S,HP','A,NA,HP',{attackerState:'S',projectile:true}),false);
assert.equal(attackAttributeMatches('A,H','A,NA,HP',{projectile:true}),true);
assert.equal(attackAttributeMatches('S','S,NA',{attackerState:'S'}),false);
console.log('Pinned native attribute compiler masks, aggregate tokens, multi-attack attributes and strict/lenient parsing passed');