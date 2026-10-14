export function createActorUnhittableTime(){
 const actors=new Map();
 return {
  set(key,value,tick){const time=Math.trunc(Number(value))|0;if(time<0)return;actors.set(key,{time,created:tick,prepared:tick})},
  remaining:key=>actors.get(key)?.time??0,
  prepare(key,tick,{paused=false}={}){const actor=actors.get(key);if(!actor||paused||actor.created>=tick||actor.prepared===tick)return;actor.prepared=tick;if(actor.time>0)actor.time--;if(actor.time===0)actors.delete(key)},
  clear:()=>actors.clear()
 };
}
