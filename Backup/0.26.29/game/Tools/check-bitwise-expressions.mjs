import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {evaluateTypedNumericAST,isConstantNumericExpression} from '../Engine/expression-numeric-types.js';
import {assignExpressionVariable} from '../Engine/variables.js';

const source=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const parser=source.slice(source.indexOf('function tokenizeExpr('),source.indexOf('function queryValue('));
const evaluator=source.slice(source.indexOf('function evalAST('),source.indexOf('const exprCache='));
const actor={vars:Array(60).fill(0),fvars:Array(40).fill(0),sysvars:[],sysfvars:[],elemTime:()=>0};
actor.query=name=>({'time':13,'life':1000,'lifemax':1000,'stateno':1000,'pos x':13,'pos y':-13,'vel x':13,'vel y':-13,'vel z':0})[name.toLowerCase()];
const context=vm.createContext({evaluateTypedNumericAST,isConstantNumericExpression,assignExpressionVariable,testContext:actor});
vm.runInContext(parser+'\n'+evaluator,context);
const execute=expression=>vm.runInContext('evalAST(parseExprAST('+JSON.stringify(expression)+'),testContext)',context);
for(const profile of ['mugen11','ikemen']){
 actor.engineProfile=profile;actor.vars[0]=13;actor.fvars[0]=13;
 assert.equal(Number(execute('2=1<1')),0);
 assert.equal(Number(execute('2!=1<1')),1);
 assert.equal(execute('-5%2'),-1);
 for(const expression of ['5.9%2.1','5.0%2','FVar(0)%2']){
  const result=execute(expression);
  if(profile==='mugen11')assert.ok(Number.isNaN(result),expression);
  else assert.equal(result,1,expression);
 }
 for(const expression of ['(1/0)+2','(1/0)-2','(1/0)*2','(1/0)/2','(1/0)=0','(1/0)!=0','-(1/0)','~(1/0)']){
  const result=execute(expression);
  if(profile==='mugen11')assert.ok(Number.isNaN(result),expression);
  else assert.equal(Number(result),({'(1/0)+2':2,'(1/0)-2':-2,'(1/0)*2':0,'(1/0)/2':0,'(1/0)=0':1,'(1/0)!=0':0,'-(1/0)':0,'~(1/0)':-1})[expression],expression);
 }
 if(profile==='ikemen')assert.ok(Number.isNaN(execute('!(1/0)')));
 else assert.equal(execute('!(1/0)'),true);
 assert.equal(execute('13&7'),5);
 assert.equal(execute('13|2'),15);
 assert.equal(execute('13^7'),10);
 assert.equal(execute('~13'),-14);
 assert.equal(execute('~~13'),13);
 assert.throws(()=>execute('~UnknownQuery'),/Unsupported numeric operand type/);
 assert.equal(execute('1|2^3&6'),1);
 assert.equal(execute('4&2=2'),0);
 assert.equal(execute('1+2&7'),3);
 assert.equal(execute('(Var(0)&7)/2'),2);
 assert.equal(execute('(Time&7)/2'),2);
 assert.equal(execute('Time/2'),6);
 assert.equal(execute('Pos X/2'),6.5);
 for(const query of ['Pos X','Pos Y','Vel X','Vel Y','Vel Z']){
  const result=execute(query+'&7');
  if(profile==='mugen11')assert.ok(Number.isNaN(result),query);
  else assert.equal(result,actor.query(query)&7,query);
 }
 assert.equal(execute('Var(2):=13&7'),5);assert.equal(actor.vars[2],13);
 actor.vars[3]=0;
 assert.equal(execute('0&(Var(3):=7)'),0);assert.equal(actor.vars[3],7);
 for(const expression of ['13.0&7','FVar(0)&7','~13.0','(13.0&7)|1']){
  const result=execute(expression);
  if(profile==='mugen11')assert.ok(Number.isNaN(result),expression);
  else assert.equal(result,expression.startsWith('~')?-14:5,expression);
 }
}
console.log('Actual parser/evaluator bitwise literals, variables, precedence, eager operands and profile float rules passed; query tags and full bottom propagation remain Pending');
