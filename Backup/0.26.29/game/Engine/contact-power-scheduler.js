import {clearActorRegistry} from './actor-registry-cleanup.js';
export function createContactPowerScheduler({findActor,addPower,compatibility,tick}){
 const pending=new Map();
 const integer=value=>Math.trunc(Number(value))|0;
 function credit(key,value,{lane='source'}={}){
  if(lane!=='source'&&lane!=='receiver')throw Error('Invalid contact power lane '+lane);
  const amount=integer(value),actor=findActor(key);
  if(!actor||amount===0)return false;
  if(compatibility(actor)==='mugen'){addPower(actor,amount);return true}
  const created=tick?.()??null,credits=pending.get(key)??[],current=credits.find(credit=>credit.created===created&&credit.lane===lane);
  if(current)current.amount=integer(current.amount+amount);else credits.push({created,amount,lane});
  pending.set(key,credits);
  return true;
 }
 function finish(){
  const current=tick?.()??null;
  for(const [key,credits] of pending){
   const ready=credits.filter(credit=>current===null||credit.created<current).sort((first,second)=>Number(first.created??0)-Number(second.created??0)||Number(first.lane==='source')-Number(second.lane==='source')),retained=credits.filter(credit=>current!==null&&credit.created>=current);
   if(retained.length)pending.set(key,retained);else pending.delete(key);
   const actor=findActor(key);for(const credit of ready)if(actor&&credit.amount!==0)addPower(actor,credit.amount);
  }
 }
 return {credit,finish,pending:(key,lane)=>(pending.get(key)??[]).filter(credit=>lane===undefined||credit.lane===lane).reduce((sum,credit)=>integer(sum+credit.amount),0),clear:keepKeys=>clearActorRegistry(pending,keepKeys)};
}
