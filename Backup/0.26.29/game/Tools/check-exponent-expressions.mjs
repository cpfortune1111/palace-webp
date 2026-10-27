import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {evaluateTypedNumericAST,isConstantNumericExpression} from '../Engine/expression-numeric-types.js';
import {assignExpressionVariable} from '../Engine/variables.js';

const source=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const parser=source.slice(source.indexOf('function tokenizeExpr('),source.indexOf('function queryValue('));
const evaluator=source.slice(source.indexOf('function evalAST('),source.indexOf('const exprCache='));
const actor={vars:Array(60).fill(0),fvars:Array(40).fill(0),sysvars:[],sysfvars:[],elemTime:()=>0};
const context=vm.createContext({evaluateTypedNumericAST,isConstantNumericExpression,assignExpressionVariable,testContext:actor});
vm.runInContext(parser+'\n'+evaluator,context);
const execute=expression=>vm.runInContext('evalAST(parseExprAST('+JSON.stringify(expression)+'),testContext)',context);
for(const profile of ['mugen11','ikemen']){
 actor.engineProfile=profile;actor.vars.fill(0);actor.vars[0]=2;
 for(const [expression,expected] of [['0**0',1],['2**3',8],['2**3**2',64],['2*3**2',18],['-2**2',4],['2**-2',.25],['4.0**.5',2],['(2**3)/3',2],['Var(0)**3',8],['1**2147483647',1]])assert.equal(execute(expression),expected,expression);
 assert.equal(execute('2**31'),profile==='ikemen'?-2147483648:2147483647);
 assert.equal(execute('2**32'),profile==='ikemen'?0:2147483647);
 assert.equal(execute('(-2)**2/3'),profile==='ikemen'?1:Math.fround(4/3));
 assert.ok(Number.isNaN(execute('(-1)**.5')));
 assert.equal(execute('(Var(1):=2)**(Var(2):=3)'),8);
 assert.equal(actor.vars[1],2);assert.equal(actor.vars[2],3);
 vm.runInContext("cachedPower=parseExprAST('Var(0)**2/3')",context);
 actor.vars[0]=2;assert.equal(vm.runInContext('evalAST(cachedPower,testContext)',context),1);
 actor.vars[0]=-2;assert.equal(vm.runInContext('evalAST(cachedPower,testContext)',context),profile==='ikemen'?1:Math.fround(4/3));
}
console.log('Actual exponent parser/evaluator precedence, eager writes, float32 promotion, cached dynamic tags and native-profile overflow passed; legacy versions and diagnostics remain Pending');
