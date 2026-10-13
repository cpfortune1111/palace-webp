export function applyTargetStateController(controller,caller,api){
 if(String(controller.type).toLowerCase()!=='targetstate')return false;
 const params=controller.params||{},integer=value=>Math.trunc(Number(api.evaluate(value)))|0;
 const owner=params.redirectid===undefined?caller:api.findActor(integer(params.redirectid));
 if(!owner)return true;
 const hitId=params.id===undefined?-1:integer(params.id),index=params.index===undefined?-1:integer(params.index),state=integer(params.value??-1);
 if(state<0)return true;
 const stateOwner=api.stateOwner(owner,controller);
 for(const id of api.targets(owner).select(hitId,index,api.findActor)){const target=api.findActor(id);if(!target)continue;
  api.setControl(target,false);api.changeState(target,state,stateOwner);
 }
 return true;
}