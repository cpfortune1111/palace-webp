import {nativeAttackActivity} from './reversal-priority.js';

export function createAttackActivityStore(){
 let currentTick=null;
 const actors=new Map();
 return {
  actor(key,tick,{moveType,reversal=false}){
   if(currentTick!==tick){actors.clear();currentTick=tick}
   if(!actors.has(key))actors.set(key,{temporaryActive:nativeAttackActivity(moveType,reversal),reversal});
   return actors.get(key);
  },
  invalidate:key=>actors.delete(key),
  clear(){actors.clear();currentTick=null}
 };
}
