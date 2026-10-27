import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {evaluateTypedNumericAST} from '../Engine/expression-numeric-types.js';
import {assignExpressionVariable} from '../Engine/variables.js';

const source=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const parser=source.slice(source.indexOf('function tokenizeExpr('),source.indexOf('function queryValue('));
const evaluator=source.slice(source.indexOf('function evalAST('),source.indexOf('const exprCache='));
const storage=()=>({vars:Array(60).fill(0),fvars:Array(40).fill(0),sysvars:Array(10).fill(0),sysfvars:Array(5).fill(0)});
const caller=storage(),recipient=storage();
recipient.originalContext=()=>caller;caller.redirect=()=>recipient;
const context=vm.createContext({evaluateTypedNumericAST,assignExpressionVariable,animElemTime:()=>0,testContext:caller,runtimeVar:caller.vars,runtimeFVar:caller.fvars,runtimeSysVar:caller.sysvars,runtimeSysFVar:caller.sysfvars});
vm.runInContext(parser+'\n'+evaluator,context);
const execute=expression=>vm.runInContext('evalAST(parseExprAST('+JSON.stringify(expression)+'),testContext)',context);
for(const [expression,expected] of [
 ['Var(0):=5.9',5],['(Var(0):=5)/2',2],['(FVar(0):=5)/2',2.5],
 ['SysVar(0):=2147483647+1',-2147483648],['SysFVar(0):=.1',Math.fround(.1)],
 ['(Var(0):=Var(1):=7)+1',8],['Var(0):=3<2',0],
 ['Var(Var(1):=3):=Var(1)+4',7],['-(Var(10):=Var(10)+1)',-1]
])assert.equal(execute(expression),expected,expression);
assert.equal(caller.vars[0],0);assert.equal(caller.vars[1],3);assert.equal(caller.vars[3],7);assert.equal(caller.vars[10],1);
caller.vars[0]=2;caller.vars[1]=6;recipient.vars[0]=50;recipient.vars[1]=90;
assert.equal(execute('Parent, Var(Var(0)):=Var(1)+1'),7);
assert.equal(recipient.vars[2],7);assert.equal(recipient.vars[50],0);assert.equal(caller.vars[2],0);
assert.ok(Number.isNaN(execute('Var(-1):=Var(1):=9')));assert.equal(caller.vars[1],9);assert.equal(caller.vars[-1],undefined);
assert.ok(Number.isNaN(execute('Var(1000):=7')));assert.equal(caller.vars[1000],undefined);
caller.compatibility='ikemen';assert.equal(execute('Var(1000):=7'),7);assert.equal(caller.vars[1000],7);
assert.throws(()=>execute('Time:=1'),/AST trailing/);
assert.throws(()=>execute('Const(1):=3'),/assignment target/);
console.log('Actual assignment parser/evaluator checks four variable families, typed results, comparison RHS, index-before-value ordering, caller-scoped redirected operands and bounded/unlimited writes; full VM/version fidelity remains uncertified');
