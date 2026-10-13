export function applyTargetVelocityController(controller,caller,api){
 const type=String(controller.type).toLowerCase();
 if(type!=='targetvelset'&&type!=='targetveladd')return false;
 const params=controller.params||{},integer=value=>Math.trunc(Number(api.evaluate(value)))|0;
 const owner=params.redirectid===undefined?caller:api.findActor(integer(params.redirectid));
 if(!owner)return true;
 const hitId=params.id===undefined?-1:integer(params.id),index=params.index===undefined?-1:integer(params.index);
 const scale=api.scale||(()=>1),ratio=Math.fround(scale(caller)/scale(owner)),values={};
 for(const axis of ['x','y','z'])if(params[axis]!==undefined)values[axis]=Math.fround(Math.fround(Number(api.evaluate(params[axis])))*ratio);
 const targets=api.targets(owner).select(hitId,index,api.findActor);
 for(const axis of ['x','y','z']){
  if(values[axis]===undefined)continue;
  let value=values[axis];
  for(const id of targets){const target=api.findActor(id);if(!target)continue;
   value=Math.fround(value*Math.fround(scale(owner)/scale(target)));
   api.setVelocity(target,axis,type==='targetveladd'?Math.fround(api.velocity(target,axis)+value):value);
  }
 }
 return true;
}