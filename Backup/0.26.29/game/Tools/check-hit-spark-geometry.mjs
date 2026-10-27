import assert from 'node:assert/strict';
import {hitSparkGeometry} from '../Engine/hit-spark-geometry.js';
const attacker={x:100,y:-80,facing:1},defender={x:120,y:-20,facing:-1};
assert.deepEqual(hitSparkGeometry(attacker,defender,[10,-100],[-10,-60,30,0],{attackerScale:2,defenderScale:0.5,boxScale:0.5}),{x:85,y:-280,sparkx:70,sparky:-520});
assert.deepEqual(hitSparkGeometry(attacker,{...defender,facing:1},[10,-100],[-10,-60,30,0],{attackerScale:2,defenderScale:0.5,boxScale:0.5}),{x:105,y:-280,sparkx:-30,sparky:-520});
console.log('Native hitspark front/back selection, positive back edge, source scaling and recipient-relative mirrored queries passed');
