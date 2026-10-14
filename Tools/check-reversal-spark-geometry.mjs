import assert from 'node:assert/strict';
import {reversalSparkGeometry} from '../Engine/reversal-spark-geometry.js';
import {hitSparkSourceOffset} from '../Engine/hit-spark-geometry.js';
import {reversalHitData} from '../Engine/reversal-hit-data.js';

const source={x:100,y:-80,facing:-1},target={x:120,y:-20,facing:1},point=reversalSparkGeometry(source,target,[10,-5],[999,-30],{sourceScale:2,targetScale:0.5});
assert.deepEqual(point,{x:80,y:-45,sparkx:-80,sparky:-50});
assert.deepEqual(hitSparkSourceOffset(point,source,2),{sparkx:10,sparky:17.5});
assert.deepEqual(reversalSparkGeometry(source,target,[10,-5],[-999,-30],{sourceScale:2,targetScale:0.5}),point);
const reset=reversalHitData({sparkx:point.sparkx,sparky:point.sparky},{attr:0,id:7},{playerno:0,playerid:1,teamside:0});
assert.equal(reset.sparkx,undefined);assert.equal(reset.sparky,undefined);
console.log('Pinned reversal spark X is performer-relative; Y inherits enemy spark Y, and recipient spark queries are cleared by later reversal reset');
