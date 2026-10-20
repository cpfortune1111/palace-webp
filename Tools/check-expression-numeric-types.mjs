import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {evaluateTypedNumericAST} from '../Engine/expression-numeric-types.js';

const source=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const parser=source.slice(source.indexOf('function tokenizeExpr('),source.indexOf('function queryValue('));
const evaluator=source.slice(source.indexOf('function evalAST('),source.indexOf('const exprCache='));
const context=vm.createContext({evaluateTypedNumericAST,animElemTime:()=>0,runtimeVar:[5],runtimeFVar:[1.5],runtimeSysVar:[7],runtimeSysFVar:[.25],testContext:{vars:[5],fvars:[1.5],sysvars:[7],sysfvars:[.25]}});
vm.runInContext(parser+'\n'+evaluator,context);
const execute=expression=>vm.runInContext('evalAST(parseExprAST('+JSON.stringify(expression)+'),testContext)',context);
for(const [expression,expected]of [['1/4',0],['1.0/4',.25],['1/4.0',.25],['-5/2',-2],['(5/2)*2',4],['var(0)/2',2],['fvar(0)/4',.375],['sysvar(0)/2',3],['sysfvar(0)*2',.5],['2147483647+1',-2147483648],['65536*65536',0],['(16777216.0+1.0)=16777216.0',true],['16777217=16777216.0',true]])assert.equal(execute(expression),expected,expression);
assert.ok(Number.isNaN(execute('5.9%2.1')));
vm.runInContext("testContext.engineProfile='ikemen'",context);
assert.equal(execute('5.9%2.1'),1);
console.log('Actual parser/evaluator preserves integer division, decimal/variable types, signed wrapping, float32 arithmetic and native modulus coercion');
