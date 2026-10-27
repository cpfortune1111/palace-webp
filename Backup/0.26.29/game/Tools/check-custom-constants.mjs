import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {nativeConstantNames} from '../Engine/native-constant-names.js';
import {customConstant} from '../Engine/custom-constants.js';

const audit=JSON.parse(readFileSync(new URL('../Docs/CONST-AUDIT.json',import.meta.url),'utf8'));
assert.deepEqual([...nativeConstantNames],audit.rows.map(row=>row.name));
assert.equal(nativeConstantNames.size,138);
for(const name of nativeConstantNames)assert.deepEqual(customConstant(name,{[name]:99}),{handled:false});
assert.deepEqual(customConstant('missing'),{handled:true,value:0});
assert.deepEqual(customConstant('My.Rate',{'my.rate':1.23456789}),{handled:true,value:Math.fround(1.23456789)});
assert.deepEqual(customConstant('zero',{zero:0}),{handled:true,value:0});
assert.deepEqual(customConstant('toString'),{handled:true,value:0});
assert.deepEqual(customConstant('constructor'),{handled:true,value:0});
assert.equal(customConstant('infinite',{infinite:'Infinity'}).value,Infinity);
assert.equal(customConstant('negative',{negative:'-Infinity'}).value,-Infinity);
assert.ok(Number.isNaN(customConstant('notnumber',{notnumber:'NaN'}).value));
assert.ok(Object.is(customConstant('negativezero',{negativezero:-0}).value,-0));
console.log('Custom Const values use float32/default zero without concealing any of 138 native builtin names');
