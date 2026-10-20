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
 actor.engineProfile=profile;actor.vars.fill(0);actor.vars[0]=5;
 for(const [expression,expected] of [['1=[1,2]',true],['1=(1,2]',false],['2=[1,2)',false],['2=(1,2)',false],['2!=(1,2)',true],['(2=[1,3])/2',0],['16777217=[16777216.0,16777216.0]',true],['16777217!=[16777216.0,16777216.0]',false]])assert.equal(execute(expression),expected,expression);
 for(const expression of ['(Var(0)/0)=[0,1]','(Var(0)/0)!=[0,1]','Var(0)=[1/0,10]','Var(0)!=[0,1/0]'])assert.ok(Number.isNaN(execute(expression)),expression);
 const folded=execute('(1/0)=[0,1]');
 if(profile==='ikemen')assert.equal(folded,true);else assert.ok(Number.isNaN(folded));
 assert.equal(execute('(Var(1):=1)=[Var(1):=2,Var(1):=3]'),false);assert.equal(actor.vars[1],3);
 actor.vars[0]=16777217;actor.fvars[0]=16777216;
 vm.runInContext("cachedRange=parseExprAST('Var(0)=[Cond(Var(2),16777216,FVar(0)),16777216]')",context);
 actor.vars[2]=0;assert.equal(vm.runInContext('evalAST(cachedRange,testContext)',context),true);
 actor.vars[2]=1;assert.equal(vm.runInContext('evalAST(cachedRange,testContext)',context),false);
}
console.log('Actual interval evaluator preserves float32 promotion, open/closed bounds, eager single writes, native undefined folding and cached dynamic tags');
