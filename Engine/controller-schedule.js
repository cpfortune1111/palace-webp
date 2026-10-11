export function createControllerSchedule(){
 const counters=new Map();
 function before(index,params,{hitPause=false}={}){
  if(hitPause&&!Number(params.ignorehitpause??0))return false;
  const counter=counters.get(index)??0;
  if(counter===Infinity)return false;
  const remaining=counter-1;
  counters.set(index,remaining);
  return remaining<=0;
 }
 function executed(index,params){
  let persistent=Math.trunc(Number(params.persistent??1));
  if(!Number.isFinite(persistent))throw Error('Invalid controller persistent');
  if(persistent>128)persistent=1;
  counters.set(index,persistent<=0?Infinity:persistent);
 }
 return {before,executed,reset:()=>counters.clear()};
}
