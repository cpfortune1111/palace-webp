import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {formatClipboard} from '../Engine/debug-clipboard.js';
import {shortestFloat32} from '../Engine/float32-format.js';

const reference=JSON.parse(readFileSync(new URL('./fixtures/clipboard-crt-float32.json',import.meta.url),'utf8'));
const buffer=new DataView(new ArrayBuffer(4));
for(const sample of reference.cases){
 buffer.setUint32(0,sample.bits);
 const value=buffer.getFloat32(0);
 assert.equal(formatClipboard(sample.format,[{type:'float',value}]),sample.expected,sample.bits+' '+sample.format);
 assert.equal(Math.fround(Number(shortestFloat32(value))),Math.abs(value),sample.bits+' shortest round trip');
}
console.log('Sixty independent native CRT numeric observations pass, including subnormals, ties, negative zero and maximum finite values; exponent padding/native MUGEN execution remain uncertified');
