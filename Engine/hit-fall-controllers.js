export function applyHitFallController(controller,caller,api){
 const type=String(controller.type).toLowerCase();if(type!=='hitfallset'&&type!=='hitfallvel')return false;
 const params=controller.params||{};if(type==='hitfallset'&&params.zvel!==undefined)throw Error('HitFallSet zvel is not compiled by pinned native reference');const owner=params.redirectid===undefined?caller:api.findActor(Math.trunc(Number(api.evaluate(params.redirectid)))|0);if(!owner)return true;
 const hit=api.getHit(owner);
 if(type==='hitfallvel'){
  if(owner.moveType==='H')for(const axis of ['x','y','z']){const value=hit['fall.'+axis+'vel'];if(axis==='y'||value!==null&&value!==undefined&&!Number.isNaN(value))api.writeVelocity(owner,axis,Math.fround(Number(value??0)))}
  return true;
 }
 const flag=params.value===undefined?-1:Math.trunc(Number(api.evaluate(params.value)))|0;
 if(flag>=0)hit.fall=Number(flag!==0);
 if(!api.targeted(owner))return true;
 for(const axis of ['x','y'])if(params[axis+'vel']!==undefined){const value=Math.fround(Number(api.evaluate(params[axis+'vel'])));if(!Number.isNaN(value))hit['fall.'+axis+'vel']=value}
 return true;
}
