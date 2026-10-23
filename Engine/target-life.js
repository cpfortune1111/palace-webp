import {controllerInteger} from './controller-value-conversion.js';
import {controllerBoolean} from './controller-value-conversion.js';

export function targetLifeMultipliers(attribute,constants={}){
 const hyper=String(attribute??'').split(',').slice(1).some(value=>['ha','ht','hp','aa','at','ap','h','a'].includes(value.trim().toLowerCase()));
 const prefix=hyper?'super':'default';
 return {redLife:Math.fround(Number(constants[prefix+'.lifetoredlifemul']??0.75)),dizzy:Math.fround(Number(constants[prefix+'.lifetodizzypointsmul']??(hyper?0:1.8)))};
}

export function targetLifeDamage(value,target,{absolute=false,kill=true,compatibility='mugen'}={}){
 if(value===0)return 0;
 let damage=-value;
 if(!absolute)damage/=target.finalDefense;
 if(damage>0&&damage<1)damage=1;
 if(damage>target.life)damage=target.life;
 if(!kill&&damage>=target.life&&(target.life>0||compatibility==='mugen'))damage=target.life-1;
 const rounded=Math.sign(damage)*Math.floor(Math.abs(damage)+0.5);
 return Math.max(-2147483648,Math.min(2147483647,rounded));
}

export function targetLifeResult(damage,target){
 const delta=-damage,life=(target.life+delta)|0;
 const overflow=delta>0&&life<target.life||delta<0&&life>target.life;
 return Math.max(0,Math.min(target.lifeMax,overflow?0:life));
}

export function executeTargetLifeAddition(value,actor,options,api){
 if(value===0)return 0;
 const previous=actor.life,damage=targetLifeDamage(value,actor,{...options,compatibility:api.compatibility??'mugen'});
 if(damage>0)actor.receivedDamage=(actor.receivedDamage||0)+Math.min(previous,damage);
 if(!(previous>0&&api.noDamage)){
  actor.life=targetLifeResult(damage,actor);
  api.synchronizeRedLife(actor,actor.life);
 }
 if(options.redlife)api.redLifeAdd(actor,-damage*api.redLifeMultiplier);
 if(options.dizzy&&!api.isDizzy&&!api.noDizzyDamage)api.dizzyPointsAdd(-damage*api.dizzyMultiplier);
 actor.getHit??={};actor.getHit.kill=options.kill;
 return damage;
}

export function applyTargetLifeController(controller,caller,api){
 if(String(controller.type).toLowerCase()!=='targetlifeadd')return false;
 const params=controller.params||{},integer=value=>controllerInteger(api.evaluate(value));
 const owner=params.redirectid===undefined?caller:api.findActor(integer(params.redirectid));
 if(!owner)return true;
 if(params.value===undefined)throw Error('Missing TargetLifeAdd value');
 const hitId=params.id===undefined?-1:integer(params.id),index=params.index===undefined?-1:integer(params.index);
 const flag=(name,fallback)=>params[name]===undefined?fallback:controllerBoolean(api.evaluate(params[name]));
 const options={absolute:flag('absolute',false),kill:flag('kill',true),dizzy:flag('dizzy',true),redlife:flag('redlife',true)};
 const value=integer(params.value);
 if(value===0)return true;
 for(const id of api.targets(owner).select(hitId,index,api.findActor)){const target=api.findActor(id);if(target)api.lifeAdd(target,value,{...options,owner})}
 return true;
}
