import assert from 'node:assert/strict';
import {airTransState,resolveSpriteTrans} from '../Engine/air-trans.js';

assert.deepEqual(airTransState('A1'),{type:'add',alpha:[255,128]});
assert.deepEqual(airTransState('AS128D64'),{type:'add',alpha:[128,64]});
assert.deepEqual(airTransState('AS'),{type:'add',alpha:[255,0]});
assert.deepEqual(airTransState('SS128'),{type:'sub',alpha:[128,255]});
assert.deepEqual(airTransState('SAS128D64'),{type:'subadd',alpha:[128,64]});
assert.deepEqual(airTransState('AS16384D999'),{type:'add',alpha:[0,255]});
assert.deepEqual(resolveSpriteTrans({type:'default',alpha:[255,0]},'A'),{type:'add',alpha:[255,255]});
assert.deepEqual(resolveSpriteTrans({type:'none',alpha:[255,0]},'A'),{type:'none',alpha:[255,0]});
assert.throws(()=>airTransState('AS12D34junk'),/Invalid/);
console.log('AIR transparency types, coefficients and controller Default precedence passed');