import assert from 'node:assert/strict';
import {spawnCommonExplod} from '../Engine/common-explod.js';

const owner={x:100,y:200,z:300,facing:-1},effects=[],order=[];
const api={player:1,evaluate:expression=>Number(expression),split:expression=>String(expression).split(','),randomFloat:(low,high)=>{order.push([low,high]);return high},legacyRound:action=>action===930,hasAnimation:action=>action===12,commit:effect=>effects.push(effect)};
assert.equal(spawnCommonExplod({anim:'0'},owner,api),false);
assert.equal(spawnCommonExplod({anim:'F930'},owner,api),false);
assert.equal(spawnCommonExplod({anim:'F12',pos:'1,2,3',random:'8,12,16',scale:'2'},owner,api),true);
assert.deepEqual(order,[[-4,4],[-6,6],[-8,8]]);const effect=effects[0];
assert.deepEqual([effect.x,effect.y,effect.z],[95,208,311]);assert.deepEqual(effect.bindOffset,[5,8,11]);assert.deepEqual(effect.scale,[2,1]);assert.equal(effect.ignorehitpause,1);assert.equal(effect.bindtime,1);assert.equal(effect.gameCommon,true);
effects.length=0;order.length=0;spawnCommonExplod({anim:'F99',random:'0'},owner,api);assert.equal(effects.length,0);assert.equal(order.length,1);
assert.throws(()=>spawnCommonExplod({anim:'F12',shader:'ignored'},owner,api),/Unsupported/);
assert.throws(()=>spawnCommonExplod({anim:'F12',postype:'p2'},owner,api),/Unsupported/);
console.log('Common Explod dispatch, legacy round preservation, XYZ relative random, native defaults and unsupported-field rejection pass');
