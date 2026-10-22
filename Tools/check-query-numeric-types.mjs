import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import vm from 'node:vm';
import {evaluateTypedNumericAST,isConstantNumericExpression,numericQueryType} from '../Engine/expression-numeric-types.js';
import {assignExpressionVariable} from '../Engine/variables.js';

const source=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const parser=source.slice(source.indexOf('function tokenizeExpr('),source.indexOf('function queryValue('));
const evaluator=source.slice(source.indexOf('function evalAST('),source.indexOf('const exprCache='));
const integers=['time','stateno','life','lifemax','anim','animtime','facing','backedgebodydist','backedgedist','frontedgebodydist','frontedgedist','gametime','hitcount','hitpausetime','id','movecontact','moveguarded','movehit','movereversed','numenemy','numpartner','numproj','power','powermax','prevstateno','random','roundstate','teamside','uniqhitcount'];
const booleans=['alive','canrecover','ctrl','hitfall','hitover','hitshakeover','inguarddist'];
const floats=['pos x','pos y','vel x','vel y','vel z'];
const reference=new URL('../../outputs/ikemen-bytecode.go',import.meta.url);
if(existsSync(reference)){
 const native=readFileSync(reference,'utf8');
 for(const [names,tag] of [[integers,'I'],[booleans,'B'],[floats,'F']])for(const name of names)assert.match(native,new RegExp('case OC_'+name.replaceAll(' ','_')+':\\s*sys\\.bcStack\\.Push'+tag+'\\('),name);
 console.log('All 41 query tags match pinned native PushI/PushB/PushF source');
}else console.log('Pinned source inventory gate not run: local reference file unavailable');
let queryValue=3;
const actor={vars:[],fvars:[],sysvars:[],sysfvars:[],assertions:new Set(),elemTime:()=>0,query:()=>queryValue};
const context=vm.createContext({evaluateTypedNumericAST,isConstantNumericExpression,assignExpressionVariable,testContext:actor});
vm.runInContext(parser+'\n'+evaluator,context);
const execute=expression=>vm.runInContext('evalAST(parseExprAST('+JSON.stringify(expression)+'),testContext)',context);
for(const profile of ['mugen11','ikemen']){
 actor.engineProfile=profile;queryValue=3;
 for(const name of integers){assert.equal(numericQueryType(name),'int');assert.equal(execute(name+'/2'),1,name);}
 for(const name of booleans){assert.equal(numericQueryType(name),'bool');assert.equal(execute(name+'/2'),0,name);}
 for(const name of floats){assert.equal(numericQueryType(name),'float');assert.equal(execute(name+'/2'),1.5,name);}
 queryValue=3.9;assert.equal(execute('FrontEdgeDist/2'),1);
 queryValue=NaN;
 for(const name of [...integers,...booleans,...floats])assert.ok(Number.isNaN(execute(name)),name);
}
for(const name of ['StateType','MoveType','Name','AnimElem','UnimplementedQuery'])assert.equal(numericQueryType(name),null,name);
console.log('Actual query consumers retain 29 native integer, seven boolean and five float tags through arithmetic; untyped queries remain explicit Pending');
for(const profile of ['mugen11','ikemen']){
 actor.engineProfile=profile;queryValue=3;
 for(const name of ['AILevel','MoveCountered']){
  assert.equal(numericQueryType(name),'int');
  assert.equal(execute(name+'/2'),1);
 }
 assert.equal(numericQueryType('AILevelF'),'float');
 assert.equal(execute('AILevelF/2'),1.5);
 queryValue=3.75;
 assert.equal(execute('AILevelF/2'),1.875);
}
if(existsSync(reference)){
 const native=readFileSync(reference,'utf8');
 const integerBlock=native.slice(native.indexOf('case OC_ailevel:'),native.indexOf('case OC_alive:'));
 assert.match(integerBlock,/PushI\(int32\(c.getAILevel\(\)\)\)/);
 const floatStart=native.indexOf('case OC_ex_ailevelf:');
 assert.match(native.slice(floatStart,native.indexOf('case ',floatStart+5)),/PushF\(c.getAILevel\(\)\)/);
 assert.match(native,/case OC_ex_movecountered:\s*sys.bcStack.PushI\(c.moveCountered\(\)\)/);
}
for(const type of ['int','float']){
 let reads=0;
 const sampleApi={query:()=>{throw Error('Typed AI query sampled twice')},querySample:()=>{reads++;return {type,value:0}}};
 const expression={t:'un',op:'-',a:{t:'id',name:'AILevelF'}};
 const result=evaluateTypedNumericAST(expression,sampleApi);
 assert.equal(result.type,type);
 assert.equal(Object.is(result.value,-0),type==='float');
 assert.equal(reads,1);
}
for(const name of ['Dizzy','GuardBreak']){
 queryValue=1;
 assert.equal(numericQueryType(name),'bool');
 assert.equal(execute(name+'/2'),0);
 queryValue=0;
 assert.equal(execute(name),false);
}
if(existsSync(reference)){
 const native=readFileSync(reference,'utf8');
 assert.match(native,/case OC_ex_dizzy:\s*sys.bcStack.PushB\(c.scf\(SCF_dizzy\)\)/);
 assert.match(native,/case OC_ex_guardbreak:\s*sys.bcStack.PushB\(c.scf\(SCF_guardbreak\)\)/);
}
