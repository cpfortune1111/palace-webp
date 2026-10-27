import assert from 'node:assert/strict';
import {reversalFallDefinition} from '../Engine/reversal-fall-definition.js';

const defaults=reversalFallDefinition({},{resetOptions:{localCoord:1280,gameWidth:320}});
assert.deepEqual([defaults.id,defaults['fall.xvel'],defaults['fall.yvel'],defaults['fall.zvel'],defaults['fall.recover'],defaults['down.recovertime']],[0,null,-18,0,true,-1]);
assert.ok(Number.isNaN(defaults['fall.envshake.phase']));
const reads=[];
const result=reversalFallDefinition({fall:'yes','fall.xvelocity':'speed','fall.damage':'damage'},{evaluate:value=>{reads.push(value);return {yes:1,speed:3.5,damage:12.75}[value]}});
assert.equal(result.fall,true);assert.equal(result['air.fall'],true);
assert.equal(result['fall.xvel'],3.5);assert.equal(result['fall.damage'],12);
assert.deepEqual(reads,['yes','speed','damage']);
assert.equal(reversalFallDefinition({'fall.envshake.freq':-1})['fall.envshake.freq'],0);
console.log('Canonical reversal fall defaults preserve source-coordinate Y, zero HD Z, recovery flags, air inheritance and caller expression types');
