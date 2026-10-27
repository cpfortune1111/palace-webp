import assert from 'node:assert/strict';
import {abilityBudget,abilityProfile,abilityDamage,changeAbility} from '../Engine/ability-system.js';
const zero=abilityProfile(),maximum=abilityProfile([5,5,5,5,5,5]);
const close=(actual,expected)=>assert.ok(Math.abs(actual-expected)<1e-9,`${actual} != ${expected}`);
close(abilityDamage(4,maximum,zero,200),5.4);
close(abilityDamage(10,maximum,zero,1000),20);
close(abilityDamage(4,zero,maximum,200),2);
close(96*maximum.hp,136);close(48*maximum.super,72);close(maximum.playfulFailure,.46);
close(abilityDamage(10,maximum,zero,3050,'A,HA'),15);
close(abilityDamage(10,maximum,maximum,3050,'A,HA'),7.5);
assert.equal(abilityBudget('story'),10);assert.equal(abilityBudget('arcade'),10);assert.equal(abilityBudget('vs'),15);
let points=Array(6).fill(0);for(let index=0;index<5;index++)points=changeAbility(points,0,1,15);assert.equal(points[0],5);points=changeAbility(points,0,1,15);assert.equal(points[0],4);
assert.deepEqual(changeAbility([5,5,5,0,0,0],0,1,15),[4,5,5,0,0,0]);assert.deepEqual(changeAbility([5,5,5,0,0,0],3,1,15),[5,5,5,0,0,0]);assert.equal(changeAbility([0,0,0,0,0,0],0,-1,15)[0],0);
assert.throws(()=>abilityProfile([6,0,0,0,0,0]));
console.log('ACS formulas, budgets, cap, zero pool, subtraction and helper attack categories passed');

