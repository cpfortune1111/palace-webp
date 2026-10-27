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
recipient.originalContext=()=>caller;
recipient.localContext=()=>({...recipient,originalContext:()=>recipient});
caller.redirect=()=>recipient;
const context=vm.createContext({evaluateTypedNumericAST,assignExpressionVariable,animElemTime:()=>0,testContext:caller,runtimeVar:caller.vars,runtimeFVar:caller.fvars,runtimeSysVar:caller.sysvars,runtimeSysFVar:caller.sysfvars});
vm.runInContext(parser+'\n'+evaluator,context);
const execute=expression=>vm.runInContext('evalAST(parseExprAST('+JSON.stringify(expression)+'),testContext)',context);
for(const [name,condition,value,final] of [['IfElse',1,1,11],['IfElse',0,11,11],['Cond',1,1,1],['Cond',0,10,10]]){
 caller.vars.fill(0);
 assert.equal(execute(name+'('+condition+',Var(0):=Var(0)+1,Var(0):=Var(0)+10)'),value);
 assert.equal(caller.vars[0],final,name+' branch effects');
}
caller.vars.fill(0);
assert.equal(execute('IfElse(Var(1):=Var(1)+1,Var(0):=1,Var(0):=2)'),1);
assert.equal(caller.vars[0],2);assert.equal(caller.vars[1],1);
caller.vars[0]=2;recipient.vars[0]=9;
assert.equal(execute('Parent, IfElse(1,Var(0),0)'),2);
assert.equal(execute('Parent, Cond(1,Var(0),0)'),9);
assert.equal(execute('Parent, Cond(1,Var(1):=Var(0)+1,0)'),10);
assert.equal(recipient.vars[1],10);assert.equal(caller.vars[1],1);
console.log('Native eager IfElse, lazy Cond, condition capture, branch order and redirected caller scopes passed');
assert.equal(execute('IfElse(1,5,7)/2'),2);
assert.equal(execute('Cond(0,5.0,7)/2'),3);
assert.equal(execute('IfElse(0,5,7.0)/2'),3.5);
vm.runInContext("cachedConditional=parseExprAST('IfElse(Var(2),5,7.0)/2')",context);
caller.vars[2]=1;assert.equal(vm.runInContext('evalAST(cachedConditional,testContext)',context),2);
caller.vars[2]=0;assert.equal(vm.runInContext('evalAST(cachedConditional,testContext)',context),3.5);
console.log('Conditional selected branch numeric types survive enclosing arithmetic');
