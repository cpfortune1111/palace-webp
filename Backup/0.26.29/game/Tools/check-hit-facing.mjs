import assert from 'node:assert/strict';
import {attackerHitFacing,defenderHitFacing,applyDefenderHitFacing} from '../Engine/hit-facing.js';

assert.equal(attackerHitFacing({},1,-1,false),1);
assert.equal(attackerHitFacing({p1facing:-1},1,-1,false),-1);
assert.equal(attackerHitFacing({p1facing:1},1,-1,false),1);
assert.equal(attackerHitFacing({p1getp2facing:1,p1facing:-1},1,1,false),1);
assert.equal(attackerHitFacing({p1getp2facing:-1},1,1,false),-1);
assert.equal(attackerHitFacing({p1getp2facing:0.5},1,-1,false),1);
assert.equal(attackerHitFacing({p1facing:-1},1,-1,true),1);
assert.equal(attackerHitFacing({p1facing:-1},1,-1,false,true),1);

assert.equal(defenderHitFacing({},1,false),null);
assert.equal(defenderHitFacing({p2facing:1},1,false),-1);
assert.equal(defenderHitFacing({p2facing:-1},1,false),1);
assert.equal(defenderHitFacing({p2facing:4},-1,false),1);
assert.equal(defenderHitFacing({p2facing:-4},-1,false),-1);
assert.equal(defenderHitFacing({p2facing:0.5},1,false),null);
assert.equal(defenderHitFacing({p2facing:1},1,true),null);
const fighter={facing:1,vx:5};applyDefenderHitFacing(fighter,-1);
assert.deepEqual(fighter,{facing:-1,vx:5});
console.log('Native p2facing signs, zero/guard exclusion and world velocity preservation passed');
