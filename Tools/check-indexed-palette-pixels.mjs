import assert from 'node:assert/strict';
import {indexedPalettePixels} from '../Engine/indexed-palette-pixels.js';

const indices=new Uint8Array([0,1,1,0]),source=[[10,20,30,255],[10,20,30,255]],destination=[[200,0,0,255],[0,0,200,128]];
assert.deepEqual([...indexedPalettePixels(indices,source)],Array(4).fill(source[0]).flat());
assert.deepEqual([...indexedPalettePixels(indices,destination)],[...destination[0],...destination[1],...destination[1],...destination[0]]);
assert.deepEqual([...indexedPalettePixels([2],destination)],[0,0,0,0]);
assert.throws(()=>indexedPalettePixels([256],destination),/out of range/);
assert.throws(()=>indexedPalettePixels([0],[[1,2,3]]),/palette color/);
console.log('Indexed palette rendering preserves distinct source indices with identical RGB and maps exact destination RGBA including alpha');
