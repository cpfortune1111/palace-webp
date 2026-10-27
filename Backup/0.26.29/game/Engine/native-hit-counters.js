import {clearActorRegistry} from './actor-registry-cleanup.js';
export function createNativeHitCounters(){
 const actors=new Map(),combos=[0,0];
 function actor(key){let counters=actors.get(key);if(!counters){counters={uniqHitCount:0,receivedHits:0};actors.set(key,counters)}return counters}
 function addComboHits(side,amount){if(side===0||side===1)combos[side]=(combos[side]+amount)|0}
 return {
  actor,addComboHits,
  comboCount:side=>side===0||side===1?combos[side]:0,
  contact(source,target,{unique=true,received=true,numHits=1,side=-1}={}){if(unique)actor(source).uniqHitCount=(actor(source).uniqHitCount+1)|0;if(received){actor(target).receivedHits=(actor(target).receivedHits+(numHits|0))|0;addComboHits(side,numHits|0)}},
  resetSource(key){actor(key).uniqHitCount=0},
  finishActor(key,{hitPause=false,moveType='I',guarded=false,dizzy=false}={}){if(!hitPause&&(moveType==='H'?guarded:!dizzy))actor(key).receivedHits=0},
  finishCombos(entries){const hits=[0,0];for(const entry of entries){const received=actor(entry.key).receivedHits;if(received>0&&(entry.side===0||entry.side===1)&&(entry.alive||!entry.overKo)){const side=1-entry.side;hits[side]=(hits[side]+received)|0}}for(let side=0;side<2;side++)if(hits[side]===0)combos[side]=0},
  delete(key){actors.delete(key)},
  snapshot:()=>({actors:[...actors].map(([key,value])=>[key,{...value}]),combos:[...combos]}),
  restore(snapshot){actors.clear();for(const [key,value]of snapshot.actors)actors.set(key,{...value});combos.splice(0,2,...snapshot.combos)},
  clear(keepKeys){clearActorRegistry(actors,keepKeys);combos.fill(0)}
 };
}
