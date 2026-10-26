import {parseCnsIntegerLiteral} from './cns-integer-literal.js';

export function createControllerSchedule(){
 const counters=new Map();
 function before(index,params,{hitPause=false}={}){
  if(hitPause&&!parseCnsIntegerLiteral(params.ignorehitpause??0))return false;
  const counter=counters.get(index)??0;
  if(counter===Infinity)return false;
  const remaining=counter-1;
  counters.set(index,remaining);
  return remaining<=0;
 }
 function executed(index,params){
  let persistent=parseCnsIntegerLiteral(params.persistent??1);
  if(persistent>128)persistent=1;
  counters.set(index,persistent<=0?Infinity:persistent);
 }
 function resetSlots(count,resetUnindexed=false){for(const key of counters.keys()){const slot=typeof key==='number'?key:typeof key==='string'&&key.startsWith('slot:')?Number(key.slice(5)):NaN;if(Number.isInteger(slot)?slot>=0&&slot<count:resetUnindexed)counters.delete(key)}}
 return {before,executed,resetSlots,reset:()=>counters.clear()};
}

export function createActorControllerSchedules(){
 const actors=new Map(),identities=new WeakMap();
 let serial=0;
 function controllerKey(controller){
  if(Number.isInteger(controller.controllerSchedulingIndex))return 'slot:'+controller.controllerSchedulingIndex;
  controller=controller.controllerSchedulingKey||controller;
  if(controller.source?.file&&controller.source?.line!==undefined)return controller.source.file+':'+controller.source.line;
  if(!identities.has(controller))identities.set(controller,++serial);
  return identities.get(controller);
 }
 function entryFor(actor,generation){
  let entry=actors.get(actor);
  if(!entry||entry.generation!==generation){entry={generation,schedule:createControllerSchedule(),cursor:entry?.cursor??{index:-1},phase:{skipIndex:-1,carried:false}};actors.set(actor,entry)}
  return entry;
 }
 function prepareEntry(entry,controller,options={}){
  const params=controller.params||controller;
  if(options.global)return {eligible:!options.hitPause||!!parseCnsIntegerLiteral(params.ignorehitpause??0),executed:()=>{}};
  const index=controller.controllerSchedulingIndex;
  if(Number.isInteger(index))entry.cursor.index=index;
  if(options.hitPause&&Number.isInteger(index)&&entry.phase.carried&&index===entry.phase.skipIndex)return {eligible:false,executed:()=>{}};
  const key=controllerKey(controller);
  return {eligible:entry.schedule.before(key,params,options),executed:()=>entry.schedule.executed(key,params)};
 }
 function prepare(actor,generation,controller,options={}){
  return prepareEntry(options.global?null:entryFor(actor,generation),controller,options);
 }
 function capture(actor,generation){
  const entry=entryFor(actor,generation);
  return {prepare:(controller,options={})=>prepareEntry(entry,controller,options)};
 }
 function carryTo(actor,fromGeneration,toGeneration,slotCount){const entry=entryFor(actor,fromGeneration);entry.phase.carried=true;entry.phase.slotCount=slotCount;entry.phase.skipIndex=entry.cursor.index;actors.set(actor,{generation:toGeneration,schedule:entry.schedule,cursor:entry.cursor,phase:entry.phase})}
 function selectTo(actor,fromGeneration,toGeneration,slotCount){const entry=entryFor(actor,fromGeneration);entry.schedule.resetSlots(slotCount,true);actors.set(actor,{generation:toGeneration,schedule:entry.schedule,cursor:entry.cursor,phase:{skipIndex:-1,carried:false,slotCount}})}
 function releaseCarry(actor,generation){const entry=actors.get(actor);if(!entry||entry.generation!==generation||!entry.phase.carried)return false;if(Number.isInteger(entry.phase.slotCount))entry.schedule.resetSlots(entry.phase.slotCount);else entry.schedule.reset();entry.phase.carried=false;entry.phase.skipIndex=-1;return true}
 function visit(actor,generation,index){entryFor(actor,generation).cursor.index=index}
 return {prepare,capture,carryTo,selectTo,releaseCarry,visit,reset:()=>actors.clear()};
}
