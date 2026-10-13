export function helperTypeParameter(value='normal',{zss=false}={}){
 const type=String(value).toLowerCase();
 if(type==='normal')return 1;
 if(type==='player')return 2;
 if(type.startsWith('proj')&&(!zss||type==='projectile'))return 3;
 throw Error('Invalid helpertype: '+value);
}

export function executeTargetPowerAddition(target,value,api){
 if(value===0||api.locked?.())return;
 const owner=api.powerOwner(target);
 const sum=Math.max(-2147483648,Math.min(2147483647,owner.power+value));
 owner.power=api.maximumPower?.()?owner.powerMax:Math.max(0,Math.min(owner.powerMax,sum));
}

export function applyTargetPowerController(controller,caller,api){
 if(String(controller.type).toLowerCase()!=='targetpoweradd')return false;
 const params=controller.params||{},integer=value=>Math.trunc(Number(api.evaluate(value)))|0;
 if(params.value===undefined)throw Error('Missing TargetPowerAdd value');
 const owner=params.redirectid===undefined?caller:api.findActor(integer(params.redirectid));
 if(!owner)return true;
 const hitId=params.id===undefined?-1:integer(params.id),index=params.index===undefined?-1:integer(params.index),value=integer(params.value);
 if(value===0)return true;
 for(const id of api.targets(owner).select(hitId,index,api.findActor)){const target=api.findActor(id);if(target&&api.isPlayerType(target))executeTargetPowerAddition(target,value,api)}
 return true;
}

