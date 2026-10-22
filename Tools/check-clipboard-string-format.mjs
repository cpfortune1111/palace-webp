import assert from 'node:assert/strict';
import {formatClipboard} from '../Engine/debug-clipboard.js';

const string=value=>({type:'string',value}),integer=value=>({type:'int',value}),float=value=>({type:'float',value});
for(const [format,argument,expected] of [
 ['%s',string('Moon'),'Moon'],['|%4.1s|',string('😀月'),'|   😀|'],['%04s',string('月'),'000月'],
 ['%.1q',string('月火'),'"月"'],['%+q',string('月'),'"\\u6708"'],['%#q',string('Moon'),'`Moon`'],
 ['%q',string('Moon\n'),'"Moon\\n"'],['%v',string('Moon'),'Moon'],['%#v',string('Moon'),'"Moon"'],
 ['%v',float(1.2),'1.2'],['%+v',integer(3),'3'],['%q',integer(65),"'A'"],
 ['%s',integer(3),'%!s(int32=3)'],['%q',float(1.25),'%!q(float32=1.25)'],['%d',string('Moon'),'%!d(string=Moon)']
])assert.equal(formatClipboard(format,[argument],{profile:'ikemen'}),expected,format);
assert.throws(()=>formatClipboard('%s',[string('Moon')]),/Unsupported clipboard format/);
console.log('Pinned Go clipboard string/quote/default formatting preserves rune precision, Unicode padding, quoting flags and numeric mismatch diagnostics');
