import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {evaluateTypedNumericAST,isConstantNumericExpression} from '../Engine/expression-numeric-types.js';
import {assignExpressionVariable} from '../Engine/variables.js';
import {actorAssertionFlags} from '../Engine/damage-assertions.js';

const source=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const parser=source.slice(source.indexOf('function tokenizeExpr('),source.indexOf('function queryValue('));
const evaluator=source.slice(source.indexOf('function evalAST('),source.indexOf('const exprCache='));
const calls=[];
const count=family=>id=>{calls.push({family,id});return 5};
const actor={selfAnimExist:anim=>anim===0,vars:Array(60).fill(0),fvars:[],sysvars:[],sysfvars:[],elemTime:count('animelemtime'),numHelper:count('numhelper'),numProj:count('numprojid'),numExplod:count('numexplod'),numTarget:count('numtarget'),playerIDExist:id=>{calls.push({family:'playeridexist',id});return true},assertions:new Set(['noautoturn'])};
const context=vm.createContext({evaluateTypedNumericAST,isConstantNumericExpression,assignExpressionVariable,testContext:actor,framesFor:anim=>anim===0?[{time:1}]:[],actorAssertionFlags});
vm.runInContext(parser+'\n'+evaluator,context);
const execute=expression=>vm.runInContext('evalAST(parseExprAST('+JSON.stringify(expression)+'),testContext)',context);
for(const profile of ['mugen11','ikemen']){
 actor.engineProfile=profile;
 for(const expression of ['NumHelper(1/0)','NumExplod(1/0)','NumProjID(1/0)','NumTarget(1/0)','PlayerIDExist(1/0)','SelfAnimExist(1/0)','AnimElemTime(1/0)'])assert.ok(Number.isNaN(execute(expression)),expression);
 for(const expression of ['NumHelper/2','NumExplod/2','NumTarget/2','NumExplod()/2','NumTarget()/2'])assert.equal(execute(expression),2,expression);
 for(const expression of ['NumHelper(1)/2','NumHelper()/2','NumProjID(1)/2','NumExplod(1)/2','NumTarget(1)/2','AnimElemTime(1)/2'])assert.equal(execute(expression),2,expression);
 for(const expression of ['PlayerIDExist(1)/2','SelfAnimExist(0)/2','IsAsserted(noautoturn)/2'])assert.equal(execute(expression),0,expression);
 assert.equal(execute('SelfAnimExist(999)'),false);
 calls.length=0;
 assert.equal(execute('NumHelper(Var(1):=7)/2'),2);assert.equal(actor.vars[1],7);
 assert.deepEqual(calls,[{family:'numhelper',id:7}]);
 calls.length=0;assert.equal(execute('NumProjID(-7)/2'),2);assert.deepEqual(calls,[{family:'numprojid',id:0}]);
 calls.length=0;assert.equal(execute('NumHelper(7.9)/2'),2);assert.deepEqual(calls,[{family:'numhelper',id:7}]);
 const recipient={...actor,vars:Array(60).fill(99),numHelper:count('recipient'),originalContext:()=>actor};
 actor.redirect=()=>recipient;calls.length=0;
 assert.equal(execute('Enemy,NumHelper(Var(2):=8)'),5);
 assert.equal(actor.vars[2],8);assert.equal(recipient.vars[2],99);assert.deepEqual(calls,[{family:'recipient',id:8}]);
 calls.length=0;assert.ok(Number.isNaN(execute('NumHelper(1/0)')));assert.deepEqual(calls,[]);
 assert.equal(execute('(NumHelper(1)&&NumExplod(2))/2'),profile==='ikemen'?2:0);
}
console.log('Actual intrinsic handlers retain integer/boolean query-call results through arithmetic and logical consumers without double-evaluating ID operands');
