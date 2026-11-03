// Root AI only. Direction is facing-relative; turning does not alter this lock.
export function guardStartupPending(actor,duration){return actor.state===120&&[120,121].includes(actor.anim)&&actor.time-(actor.animStartTime||0)<duration}
export function createAIWalkGate(minTicks=6){
 const slots=new Map();
 return {reset(player){if(player===undefined)slots.clear();else slots.delete(player)},velocity(player,entry,tick,requested){
  if(!Number.isFinite(requested)||requested===0)return requested;
  let slot=slots.get(player);const direction=Math.sign(requested);
  if(!slot||slot.entry!==entry){slot={entry,tick,age:0,direction,speed:requested};slots.set(player,slot);return requested}
  if(slot.tick!==tick){slot.tick=tick;slot.age=Math.min(minTicks,slot.age+1)}
  if(direction!==slot.direction){if(slot.age<minTicks)return slot.speed;slot.direction=direction;slot.age=0}
  slot.speed=requested;return requested;
 }};
}
