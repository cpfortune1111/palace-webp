import {controllerBoolean} from './controller-value-conversion.js';

const integer=value=>Math.trunc(Number(value))|0;
const rounded=value=>Math.sign(value)*Math.floor(Math.abs(value)+0.5);

export function synchronizeLifeRedLife(actor,life,enabled=true){
 if(life<=0)actor.redLife=0;
 else if(!enabled)actor.redLife=life;
}

export function hitRedLifeDamage(value,multiplier,defense,life,bounded=true){
 if(value===0||multiplier===0)return 0;
 let damage=value*Math.fround(multiplier)/defense;
 if(damage>0&&damage<1)damage=1;
 if(bounded&&damage>life)damage=life;
 return Math.max(-2147483648,Math.min(2147483647,rounded(damage)));
}

export function consumeHitRedLife(actor,damage,life,enabled,noDamage){
 if(damage===0)return;
 if(life<=0)actor.redLife=0;
 else if(enabled&&!noDamage)actor.redLife=Math.max(life,Math.min(actor.lifeMax,actor.redLife-damage));
}

export function applyRedLifeController(controller,actor,api){
 const type=controller.type.toLowerCase();
 if(!['redlifeadd','redlifeset'].includes(type))return false;
 const params=controller.params||controller;
 const target=params.redirectid===undefined?actor:api.findActor(integer(api.evaluate(params.redirectid)));
 if(!target)return true;
 if(params.value===undefined)throw Error('Missing '+controller.type+' value');
 const absolute=type==='redlifeadd'&&params.absolute!==undefined?controllerBoolean(api.evaluate(params.absolute)):false;
 const value=integer(api.evaluate(params.value));
 if(type==='redlifeadd'&&value===0)return true;
 let next=value;
 if(type==='redlifeadd'){
  const addition=absolute?value:value/target.finalDefense;
  next=Math.max(-2147483648,Math.min(2147483647,target.redLife+rounded(addition)));
 }
 if(target.life<=0)target.redLife=0;
 else if(api.enabled(target)&&!api.noDamage(target))target.redLife=Math.max(target.life,Math.min(target.lifeMax,next));
 return true;
}
