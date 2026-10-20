import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {evaluateTypedNumericAST,isConstantNumericExpression} from '../Engine/expression-numeric-types.js';
import {assignExpressionVariable} from '../Engine/variables.js';

const source=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const parser=source.slice(source.indexOf('function tokenizeExpr('),source.indexOf('function queryValue('));
const evaluator=source.slice(source.indexOf('function evalAST('),source.indexOf('const exprCache='));
const actor={vars:[5],fvars:[],sysvars:[],sysfvars:[],elemTime:index=>index===2?0:-1,query:name=>({statetype:'S',movetype:'I',name:'Sailor Venus',customundefined:NaN})[name.toLowerCase()]};
const context=vm.createContext({evaluateTypedNumericAST,isConstantNumericExpression,assignExpressionVariable,testContext:actor});
vm.runInContext(parser+'\n'+evaluator,context);
const execute=expression=>vm.runInContext('evalAST(parseExprAST('+JSON.stringify(expression)+'),testContext)',context);
for(const profile of ['mugen11','ikemen']){
 actor.engineProfile=profile;
 for(const expression of ['(StateType=S)/2','(MoveType=I)/2','(Name="Sailor Venus")/2','(AnimElem=2)/2'])assert.equal(execute(expression),0,expression);
 assert.equal(execute('Name="sailor venus"'),true);
 assert.equal(execute('"1"=1'),false);
 assert.equal(execute('"1"!=1'),true);
 assert.equal(execute('AnimElem=2'),true);assert.equal(execute('AnimElem=1'),false);
 assert.equal(execute('((StateType=S)&&Var(0))/2'),profile==='ikemen'?2:0);
 const invalid=execute('(CustomUndefined=0)/2');
 if(profile==='ikemen')assert.equal(invalid,0);else assert.ok(Number.isNaN(invalid));
}
console.log('Actual comparison consumers retain boolean result tags, case-insensitive strings, typed string inequality and existing AnimElem event semantics');
