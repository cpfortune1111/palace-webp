export function applyPositionController(controller,actor,api){
 const type=controller.type.toLowerCase();
 if(!['posset','posadd'].includes(type))return false;
 const params=controller.params||controller;
 const target=params.redirectid===undefined?actor:api.findActor(Math.trunc(Number(api.evaluate(params.redirectid))));
 if(!target)return true;
 if(params.z!==undefined)throw Error('Position Z physics is not implemented');
 const ratio=(actor.localScale??1)/(target.localScale??1);
 for(const axis of ['x','y'])if(params[axis]!==undefined){
  const value=Math.fround(Math.fround(Number(api.evaluate(params[axis])))*ratio);
  const origin=axis==='x'?(api.cameraX??0)/(target.localScale??1):(target.groundLevel??0)+(target.platformY??0);
  target[axis]=Math.fround(type==='posset'?origin+value:target[axis]+value*(axis==='x'?target.facing:1));
 }
 return true;
}
