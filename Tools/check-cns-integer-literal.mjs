import assert from 'node:assert/strict';
import {parseCnsIntegerLiteral} from '../Engine/cns-integer-literal.js';

for(const [text,expected] of [['',0],['  +12 tail ',12],['-12.9',-12],['0.5',0],['-0.9',0],['1e3',1],['0x10',0],['2 + 5',2],['var(8)',0],['- 2',0],['１２',0],['2147483647',2147483647],['-2147483647',-2147483647],['2147483648',2147483647],['-2147483648',-2147483648],['999999999999999999999999',2147483647]])assert.equal(parseCnsIntegerLiteral(text),expected,text);
const warnings=[];
assert.equal(parseCnsIntegerLiteral('-2147483648',{warn:message=>warnings.push(message)}),-2147483648);
assert.deepEqual(warnings,['Atoi conversion outside int32 range: 2147483648']);
assert.ok(Object.is(parseCnsIntegerLiteral('-0'),0));
console.log('Pinned CNS Atoi literal prefixes, signs, non-expression parsing, overflow saturation and warning prefix pass; ZSS scanner behavior remains separate');
