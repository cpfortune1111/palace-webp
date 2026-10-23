import {controllerInteger} from './controller-value-conversion.js';
import {controllerFloat32} from './controller-value-conversion.js';

export function applyScoreController(controller,caller,api){
 if(String(controller.type).toLowerCase()!=='scoreadd')return false;
 const params=controller.params||{};
 if(params.value===undefined)throw Error('Missing ScoreAdd value');
 const owner=params.redirectid===undefined?caller:api.findActor(controllerInteger(api.evaluate(params.redirectid)));
 if(!owner)return true;
 const value=controllerFloat32(api.evaluate(params.value));
 if(value!==0&&!api.excluded(owner))api.add(owner,value);
 return true;
}

export function applyTargetScoreController(controller,caller,api){
 if(String(controller.type).toLowerCase()!=='targetscoreadd')return false;
 const params=controller.params||{},integer=value=>Math.trunc(Number(api.evaluate(value)))|0;
 if(params.value===undefined)throw Error('Missing TargetScoreAdd value');
 const owner=params.redirectid===undefined?caller:api.findActor(integer(params.redirectid));
 if(!owner)return true;
 const hitId=params.id===undefined?-1:integer(params.id),index=params.index===undefined?-1:integer(params.index),value=controllerFloat32(api.evaluate(params.value));
 if(value===0)return true;
 for(const id of api.targets(owner).select(hitId,index,api.findActor)){
  const target=api.findActor(id);
  if(target&&api.isPlayerType(target)&&!api.excluded(target))api.add(target,value);
 }
 return true;
}
