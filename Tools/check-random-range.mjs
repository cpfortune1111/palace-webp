import assert from 'node:assert/strict';
import {evaluateTypedNumericAST,isConstantNumericExpression} from '../Engine/expression-numeric-types.js';
import {createNativeRandom} from '../Engine/native-random.js';

const stream=createNativeRandom(1),number=value=>({t:'num',v:value,numericType:Number.isInteger(value)?'int':'float'}),call=(first,last)=>({t:'call',name:'RandomRange',args:[number(first),number(last)]});
const api={randomInteger:(first,last)=>stream.integer(first,last)};
const first=evaluateTypedNumericAST(call(5.9,9.1),api);assert.equal(first.value,5);assert.equal(first.type,'int');assert.equal(first.handled,true);assert.equal(stream.state(),16807);
assert.equal(evaluateTypedNumericAST(call(2147483647,0),api).value,282475249);
assert.equal(isConstantNumericExpression(call(7,7)),false);
const state=stream.state();assert.ok(Number.isNaN(evaluateTypedNumericAST(call(NaN,9),api).value));assert.equal(stream.state(),state);
let evaluated=false;const missing=evaluateTypedNumericAST(call(1,2),{...api,mathArguments:()=>{evaluated=true;return [{type:'int',value:NaN},{type:'int',value:9}]}});assert.ok(evaluated&&Number.isNaN(missing.value));assert.equal(stream.state(),state);
assert.equal(evaluateTypedNumericAST({t:'call',name:'RandomRange',args:[number(1)]},api).handled,false);
console.log('RandomRange typed integer results, bound truncation, reversed ranges, undefined sampling gate and nonconstant classification pass');
