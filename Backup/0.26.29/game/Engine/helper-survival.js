import {controllerBoolean} from './controller-value-conversion.js';

export function readHelperSurvival(params,evaluate){
 return {immortal:params.immortal===undefined?false:controllerBoolean(evaluate(params.immortal)),koVelocity:params.kovelocity===undefined?false:controllerBoolean(evaluate(params.kovelocity))};
}

export function helperKoVelocityEnabled(actor){return actor.kind!=='helper'||!!actor.koVelocity}

// Candidate life is already computed by the relevant Life/HitDef consumer.
// Keep damage rounding and KO-reaction prediction separate from lifeSet's invariant.
export function setHelperLife(actor,value,{noDamage=false,redLifeEnabled=true}={}){
 if(noDamage)return actor.life;
 const life=Math.max(0,Math.min(actor.lifeMax??1000,value));actor.life=life;
 if(life===0){
  const playerType=actor.kind!=='helper'||actor.helperType===2,neutral=(actor.teamSide??actor.player)===0;
  if(actor.immortal&&(!playerType||neutral))actor.life=1;
  actor.redLife=0;
 }
 if(!redLifeEnabled)actor.redLife=actor.life;
 return actor.life;
}
