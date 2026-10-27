import {controllerInteger} from './controller-value-conversion.js';

export function createProjectileContactEvents(){
 const events=new Map();
 const ownerId=actor=>actor.kind==='helper'?actor.instanceId:actor.player??actor.id;
 const allowed=actor=>!!actor&&(actor.kind!=='helper'||!!actor.ownProjectile);
 return {
  clear(){events.clear()},forget(actor){events.delete(ownerId(actor))},
  record(id,projectileId,kind,tick){if(!['hit','guarded','cancel'].includes(kind))throw Error('Invalid projectile contact kind');events.set(id,{id:controllerInteger(projectileId),kind,time:0,lastTick:tick})},
  advance(actor,tick,{paused=false,disabled=false}={}){if(!allowed(actor))return;const event=events.get(ownerId(actor));if(!event||event.lastTick===tick)return;event.lastTick=tick;if(!paused&&!disabled&&event.time>=0)event.time=(event.time+1)|0},
  time(actor,id,kind='contact'){
   if(id===undefined||Number.isNaN(Number(id)))return NaN;
   if(!allowed(actor))return -1;
   const event=events.get(ownerId(actor)),selected=controllerInteger(id);if(!event||selected>0&&event.id!==selected)return -1;
   if(kind==='contact'?event.kind==='cancel':event.kind!==kind)return -1;
   return event.time;
  },
 };
}
