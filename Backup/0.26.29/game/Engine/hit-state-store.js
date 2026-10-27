import {clearActorRegistry} from './actor-registry-cleanup.js';
export function createHitStateStore(){
 const actors=new Map();
 return {
  sample(key,tick,{moveType,fall=false,actionRun=true,disabled=false}={}){
   const actor=actors.get(key)??{tick:null,value:0};
   if(actor.tick!==tick){
    actor.tick=tick;
    if(!disabled){
     if(actionRun&&moveType!=='H'&&actor.value>0)actor.value=0;
     if(moveType==='H')actor.value=fall?2:1;
    }
    actors.set(key,actor);
   }
   return actor.value;
  },
  reverse(key){const actor=actors.get(key);if(!actor)throw Error('Reversal requires sampled native hit status');if(actor.value===0)actor.value=-1;return actor.value},
  value:key=>actors.get(key)?.value??0,
  delete:key=>actors.delete(key),
  clear:keepKeys=>clearActorRegistry(actors,keepKeys)
 };
}
