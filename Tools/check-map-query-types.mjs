import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {evaluateTypedNumericAST,isConstantNumericExpression} from '../Engine/expression-numeric-types.js';
import {assignExpressionVariable} from '../Engine/variables.js';
import {applyMapController,readStoredMapValue,writeStoredMapValue} from '../Engine/map-controllers.js';

const source=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const parser=source.slice(source.indexOf('function tokenizeExpr('),source.indexOf('function queryValue('));
const evaluator=source.slice(source.indexOf('function evalAST('),source.indexOf('const exprCache='));
const actor={maps:new Map(),mapDefaults:new Map(),vars:Array(60).fill(0),fvars:Array(40).fill(0),sysvars:Array(10).fill(0),sysfvars:Array(5).fill(0),elemTime:()=>0,query:()=>0,engineProfile:'ikemen'};
const context=vm.createContext({evaluateTypedNumericAST,isConstantNumericExpression,assignExpressionVariable,readStoredMapValue,writeStoredMapValue,testContext:actor});
vm.runInContext(parser+'\n'+evaluator,context);
const execute=expression=>vm.runInContext('evalAST(parseExprAST('+JSON.stringify(expression)+'),testContext)',context);
const sample=expression=>vm.runInContext('evalNumericAST(parseExprAST('+JSON.stringify(expression)+'),testContext)',context);
const api={evaluate:execute,sample:expression=>{const result=sample(expression);return result.handled?result:{value:execute(expression)}},findActor:()=>null};
for(const [name,value] of [['integer','3'],['floating','3.0'],['text','"3"'],['case','"MOON"'],['case2','"moon"'],['undefined','1/0']])applyMapController({type:'MapSet',params:{map:JSON.stringify(name),value}},actor,api);
for(const profile of ['mugen11','ikemen']){
 actor.engineProfile=profile;
 for(const [expression,expected] of [['Map("integer")/2',1],['Map("floating")/2',1.5],['Map("text")+2',2],['Map("text")=3',false],['Map("case")=Map("case2")',true],['!Map("text")',true],['Map("text")||5',profile==='ikemen'?5:true],['IfElse(1,Map("integer"),Map("floating"))/2',1]])assert.equal(execute(expression),expected,expression);
 assert.ok(Number.isNaN(execute('Map("undefined")')));
 assert.equal(sample('Map("missing")').type,'float');
 assert.equal(sample('Map("integer")').type,'int');
 assert.equal(sample('Map("floating")').type,'float');
}
console.log('Actual Map producer/query parser consumers preserve integer/float tags, unset float zero, string arithmetic/equality and undefined reads');
assert.equal(execute('(Map("assigned"):=3)/2'),1);
assert.equal(execute('(Map("assignedfloat"):=3.0)/2'),1.5);
assert.equal(execute('(Map("assignedtext"):="3")+2'),2);
assert.equal(execute('(Map("assignedbool"):=1=1)/2'),0);
assert.ok(Number.isNaN(execute('Map(""):=(Var(9):=7)')));
assert.equal(actor.vars[9],7);assert.equal(actor.maps.has(''),false);
