import assert from 'node:assert/strict';
import {formatClipboard} from '../Engine/debug-clipboard.js';

const integer=value=>({type:'int',value}),float=value=>({type:'float',value}),string=value=>({type:'string',value});
for(const [format,argument,expected] of [
 ['%b',integer(10),'1010'],['%#b',integer(10),'0b1010'],['%o',integer(8),'10'],['%O',integer(8),'0o10'],['%#O',integer(8),'0o010'],
 ['%#08x',integer(15),'0x0000000f'],['%#08x',integer(-15),'-0x000000f'],['%X',integer(255),'FF'],['%+5.0d',integer(0),'     '],
 ['%U',integer(-1),'U+FFFFFFFFFFFFFFFF'],['%#U',integer(65),"U+0041 'A'"],['%c',integer(128512),'😀'],['%4c',integer(26376),'   月'],
 ['%#U',integer(39),"U+0027 '''"],['%#U',integer(92),"U+005C '\\'"],['%08U',integer(65),'  U+0041'],
 ['%c',integer(-1),'�'],['%x',string('Moon'),'4d6f6f6e'],['%.2x',string('月'),'e69c'],['%# X',string('A月'),'0X41 0XE6 0X9C 0X88'],
 ['%b',float(1.5),'12582912p-23'],['%b',float(0),'0p-149'],['%b',float(2**-149),'1p-149'],
 ['%x',float(1.5),'0x1.8p+00'],['%.1X',float(1.5),'0X1.8P+00'],['%#.0x',float(1.5),'0x1.p+01'],
 ['%#x',float(1.5),'0x1.8000p+00'],['%#x',float(0),'0x0.0000p+00'],['%#X',float(1.5),'0X1.8P+00'],
 ['%.1x',float(1.03125),'0x1.0p+00'],['%.1x',float(1.09375),'0x1.2p+00'],
 ['%x',float(2**-149),'0x1p-149'],['%x',float(-0),'-0x0p+00'],['%x',float(Math.fround(3.4028234663852886e38)),'0x1.fffffep+127'],
 ['%U',float(1.25),'%!U(float32=1.25)'],['%d',float(Infinity),'%!d(float32=+Inf)'],
 ['%08F',float(Infinity),'    +Inf'],['% 08X',float(Infinity),'     Inf'],['%-08f',float(-Infinity),'-Inf    ']
])assert.equal(formatClipboard(format,[argument],{profile:'ikemen'}),expected,format);
assert.throws(()=>formatClipboard('%x',[integer(15)]),/Unsupported clipboard format/);
console.log('Pinned Go integer/base prefixes, UTF-8 byte hex, Unicode characters and exact float32 binary/hex rounding pass; complete printf grammar remains Pending');
