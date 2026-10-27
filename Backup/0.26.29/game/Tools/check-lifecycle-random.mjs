import assert from 'node:assert/strict';
import {createLifecycleRuntime} from '../Char/Venus/venus-lifecycle-runtime.js';
import {applyVariableController} from '../Engine/variables.js';

const runtime=createLifecycleRuntime({trigger:()=>true,eval:Number,controller:(controller,fighter)=>applyVariableController(controller,fighter,Number)});
const fighter={vars:Array(60).fill(0)};
const originalRandom=Math.random;
try{
 for(const [range,expectedFirst,expectedLast] of [[undefined,0,1000],['7',0,7],['3,8',3,8],['8,3',3,8],['-4,-2',-4,-2]]){
  for(const [random,expected] of [[0,expectedFirst],[0.999999999,expectedLast]]){
   Math.random=()=>random;
   runtime.execute({type:'VarRandom',params:{v:'0',...(range===undefined?{}:{range})}},fighter,{});
   assert.equal(fighter.vars[0],expected);
  }
 }
 runtime.execute({type:'VarRandom',params:{v:'60',range:'3,8'}},fighter,{});
 assert.equal(fighter.vars.length,60);
 assert.throws(()=>runtime.execute({type:'VarRandom',params:{v:'0',range:'1,2,3'}},fighter,{}),/Invalid VarRandom range/);
}finally{
 Math.random=originalRandom;
}
console.log('Lifecycle VarRandom bounds and variable storage passed');
