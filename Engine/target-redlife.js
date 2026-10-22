import {targetLifeDamage} from './target-life.js?v=02554';
import {controllerBoolean} from './controller-value-conversion.js';
import {hitPauseVersionProfile} from './hit-pause-version.js';

export function applyTargetRedLifeController(controller,caller,api){
 if(String(controller.type).toLowerCase()!=='targetredlifeadd')return false;
 const params=controller.params||{},integer=value=>Math.trunc(Number(api.evaluate(value)))|0;
 if(params.value===undefined)throw Error('Missing TargetRedLifeAdd value');
 const owner=params.redirectid===undefined?caller:api.findActor(integer(params.redirectid));
 if(!owner)return true;
 const hitId=params.id===undefined?-1:integer(params.id),index=params.index===undefined?-1:integer(params.index);
 let absolute=params.absolute!==undefined&&controllerBoolean(api.evaluate(params.absolute));
 const value=integer(params.value);
 const legacyHealing=api.versionData?!hitPauseVersionProfile(api.versionData).ikemen:api.compatibility(caller)==='mugen';
 if(value>0&&legacyHealing)absolute=true;
 if(value===0)return true;
 for(const id of api.targets(owner).select(hitId,index,api.findActor)){
  const target=api.findActor(id);
  if(!target||api.excluded(target))continue;
  const amount=targetLifeDamage(-value,api.resource(target),{absolute,kill:false,compatibility:api.compatibility(target)})||0;
  api.add(target,amount);
 }
 return true;
}
