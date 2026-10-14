export function createContactPowerScheduler({findActor,addPower,compatibility,tick}){
 const pending=new Map();
 const integer=value=>Math.trunc(Number(value))|0;
 function credit(key,value){
  const amount=integer(value),actor=findActor(key);
  if(!actor||amount===0)return false;
  if(compatibility(actor)==='mugen'){addPower(actor,amount);return true}
  const created=tick?.()??null,credits=pending.get(key)??[],last=credits.at(-1);
  if(last&&last.created===created)last.amount=integer(last.amount+amount);else credits.push({created,amount});
  pending.set(key,credits);
  return true;
 }
 function finish(){
  const current=tick?.()??null;
  for(const [key,credits] of pending){
   const ready=credits.filter(credit=>current===null||credit.created<current),retained=credits.filter(credit=>current!==null&&credit.created>=current);
   if(retained.length)pending.set(key,retained);else pending.delete(key);
   const actor=findActor(key);for(const credit of ready)if(actor&&credit.amount!==0)addPower(actor,credit.amount);
  }
 }
 return {credit,finish,pending:key=>(pending.get(key)??[]).reduce((sum,credit)=>integer(sum+credit.amount),0),clear:()=>pending.clear()};
}
