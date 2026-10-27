import assert from 'node:assert/strict';
import {stackPalFx} from '../Engine/palfx-stack.js';
import {samplePalFx} from '../Engine/palfx-runtime.js';

const base={...samplePalFx(null),add:[10,20,30],mul:[256,128,512]},extra={...samplePalFx(null),add:[-3,5,40],mul:[128,256,64]};
const normal=stackPalFx(base,extra,'add');assert.deepEqual(normal.add,[7,25,70]);assert.deepEqual(normal.mul,[128,128,128]);
const sub=stackPalFx(base,extra,'sub');assert.deepEqual(sub.add,[7,15,0]);assert.deepEqual(sub.mul,[127,123,63]);
assert.equal(stackPalFx(base,null,'sub'),base);
assert.equal(stackPalFx(null,extra,'sub'),extra);
const inverted={...extra,invertall:true,invertblend:1};
assert.equal(stackPalFx({...base,invertblend:0},inverted,'add',[255,255]).invertblend,1);
assert.equal(stackPalFx({...base,rawInvertblend:-2,invertblend:3,invertall:true,rawInvertall:true},inverted,'add',[255,255]).invertblend,-2);
assert.deepEqual(base.add,[10,20,30]);
console.log('Native PalFX stacking handles Sub clamps, identity guards and version inversion switches');