import {recordTargetedBy} from './hit-targeted-by.js';
import {clearActorRegistry} from './actor-registry-cleanup.js';

const integer=value=>Math.trunc(Number(value))|0;
const present=value=>value!==undefined&&value!==null&&!(typeof value==='string'&&!value.trim());

export function juggleBudget(entries,sourceId,fallback){
 return integer(entries?.find(entry=>entry[0]===sourceId)?.[1]??fallback);
}

export function juggleContactAllowed({cost,remaining,noCheck=false,ikemen=false,hitState=0,projectile=false,hasTarget=false}){
 return noCheck||integer(cost)<=integer(remaining)||ikemen&&hitState<2||!projectile&&!ikemen&&!hasTarget;
}

export function inheritJuggleCandidate(entries,{sourceId,originId}){
 const origin=entries?.find(entry=>entry[0]===originId);
 return origin?recordTargetedBy(entries,sourceId,origin[1]):entries;
}

export function inheritJuggleContact(entries,{sourceId,originId,maximum,cost}){
 let remaining=integer(maximum);
 for(const entry of entries??[])if((entry[0]===sourceId||entry[0]===originId)&&entry[1]<remaining)remaining=integer(entry[1]);
 return [...(entries??[]).filter(entry=>entry[0]!==originId),[originId,integer(remaining-integer(cost))]];
}

export function consumeJuggleContact(entries,sourceId,{cost,previousFall=false,fall=false,noCheck=false,guarded=false,overridden=false,getHitSet=true,projectile=false}={}){
 if(guarded||overridden||!getHitSet||!previousFall&&!fall)return {entries,clearCost:false};
 const updated=(entries??[]).map(entry=>entry.slice()),index=updated.findIndex(entry=>entry[0]===sourceId);
 if(index<0)throw Error('Missing accepted-contact juggle budget');
 if(!noCheck)updated[index][1]=integer(updated[index][1]-integer(cost));
 return {entries:updated,clearCost:!projectile};
}

export function applyStateDefJuggle(definition,api){
 if(!present(definition?.juggle))return false;
 api.setCost(integer(api.evaluate(definition.juggle)));
 return true;
}

export function createJuggleState(){
 const actors=new Map();
 const actor=key=>{if(!actors.has(key))actors.set(key,{cost:0,fallTick:null,previousFall:false});return actors.get(key)};
 return {
  cost:key=>actors.get(key)?.cost??0,
  set:(key,value)=>{actor(key).cost=integer(value)},
  sampleFall(key,tick,fall){const value=actor(key);if(value.fallTick!==tick){value.fallTick=tick;value.previousFall=!!fall}return value.previousFall},
  finish(key,{ikemen=false,moveType,actionRun=true}={}){if(ikemen&&actionRun&&moveType!=='A')actor(key).cost=0},
  snapshot:()=>[...actors].map(([key,value])=>[key,{...value}]),
  restore(snapshot){actors.clear();for(const [key,value]of snapshot)actors.set(key,{...value})},
  delete:key=>actors.delete(key),
  clear:keepKeys=>clearActorRegistry(actors,keepKeys)
 };
}
