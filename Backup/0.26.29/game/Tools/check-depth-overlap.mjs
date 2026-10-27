import assert from 'node:assert/strict';
import {depthIntervalsOverlap} from '../Engine/depth-overlap.js';
assert.equal(depthIntervalsOverlap({z:0},{z:1000}),true);
assert.equal(depthIntervalsOverlap({z:0},{z:9},{enabled:true}),false);
assert.equal(depthIntervalsOverlap({z:0},{z:8},{enabled:true}),true);
assert.equal(depthIntervalsOverlap({z:0,depth:[1,2]},{z:3,depth:[1,1]},{enabled:true}),true);
assert.equal(depthIntervalsOverlap({z:10,depth:[1,1],localScale:2},{z:20,depth:[1,1]},{enabled:true}),true);
assert.equal(depthIntervalsOverlap({z:0,depth:[-1,-1]},{z:0,depth:[-1,-1]},{enabled:true}),false);
console.log('Native disabled-Z bypass, inclusive depth edges, asymmetric/local-scaled intervals and unnormalized signed ranges passed');
