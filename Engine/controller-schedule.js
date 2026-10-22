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
 return {before,executed,reset:()=>counters.clear()};
}

export function createActorControllerSchedules(){
 const actors=new Map(),identities=new WeakMap();
 let serial=0;
 function controllerKey(controller){
  controller=controller.controllerSchedulingKey||controller;
  if(controller.source?.file&&controller.source?.line!==undefined)return controller.source.file+':'+controller.source.line;
  if(!identities.has(controller))identities.set(controller,++serial);
  return identities.get(controller);
 }
 function entryFor(actor,generation){
  let entry=actors.get(actor);
  if(!entry||entry.generation!==generation){entry={generation,schedule:createControllerSchedule()};actors.set(actor,entry)}
  return entry;
 }
 function prepareEntry(entry,controller,options={}){
  const params=controller.params||controller;
  if(options.global)return {eligible:!options.hitPause||!!parseCnsIntegerLiteral(params.ignorehitpause??0),executed:()=>{}};
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
 return {prepare,capture,reset:()=>actors.clear()};
}
