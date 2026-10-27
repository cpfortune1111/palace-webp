import assert from 'node:assert/strict';
import {nativeAttackActivity,reversalPriorityDecision} from '../Engine/reversal-priority.js';

const reversal={reversal:true,temporaryActive:1},normal={reversal:false,temporaryActive:1};
assert.equal(nativeAttackActivity('I',false),0);
assert.equal(nativeAttackActivity('I',true),1);
assert.equal(nativeAttackActivity('A',false),1);
assert.equal(nativeAttackActivity('H',false),1);
assert.equal(reversalPriorityDecision(reversal,normal,{counterContact:true}).enemyLoses,false);
assert.equal(reversalPriorityDecision(reversal,normal,{counterContact:false}).enemyLoses,true);
assert.equal(reversalPriorityDecision(normal,reversal).enemyLoses,true);
assert.deepEqual(reversalPriorityDecision(reversal,reversal,{counterContact:true}),{handled:true,enemyLoses:false,enemyTemporaryActive:-1});
assert.equal(reversalPriorityDecision(reversal,{...reversal,temporaryActive:-1},{counterContact:true}).enemyLoses,true);
assert.equal(reversalPriorityDecision(reversal,normal,{counterContact:true,projectile:true}).enemyLoses,true);
assert.equal(reversalPriorityDecision(reversal,normal,{attributeAllowed:false,alreadyHit:true}).enemyLoses,false);
assert.equal(reversalPriorityDecision(reversal,normal,{alreadyHit:true,counterContact:true}).enemyLoses,true);
assert.deepEqual(reversalPriorityDecision(normal,normal),{handled:false});
console.log('Pinned reversal arbitration preserves attribute/target precedence, counter collision, temporary attack flags and projectile exclusion');
