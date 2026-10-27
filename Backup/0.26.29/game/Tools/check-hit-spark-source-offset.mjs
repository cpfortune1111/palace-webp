import assert from 'node:assert/strict';
import {hitSparkGeometry,hitSparkSourceOffset} from '../Engine/hit-spark-geometry.js';

const source={x:100,y:-80,facing:1},target={x:120,y:-20,facing:-1},point=hitSparkGeometry(source,target,[10,-100],[-10,-60,30,0],{attackerScale:2,defenderScale:0.5,boxScale:0.5});
assert.deepEqual(hitSparkSourceOffset(point,source,2),{sparkx:-7.5,sparky:-100});
assert.deepEqual([point.sparkx,point.sparky],[70,-520]);
assert.deepEqual(hitSparkSourceOffset({x:90,y:-60},{...source,facing:-1},2),{sparkx:5,sparky:10});
console.log('Native MoveHitVar spark offsets are source-relative/facing-mirrored, distinct from recipient GetHitVar offsets');
