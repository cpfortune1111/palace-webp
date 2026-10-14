export function applyPositionController(controller,actor,api){
 const type=controller.type.toLowerCase();
 if(!['posset','posadd'].includes(type))return false;
 const params=controller.params||controller;
 const target=params.redirectid===undefined?actor:api.findActor(Math.trunc(Number(api.evaluate(params.redirectid))));
 if(!target)return true;
 const ratio=(actor.localScale??1)/(target.localScale??1);
 for(const axis of ['x','y','z'])if(params[axis]!==undefined){
  const value=Math.fround(Math.fround(Number(api.evaluate(params[axis])))*ratio);
  const origin=axis==='x'?(api.cameraX??0)/(target.localScale??1):axis==='y'?(target.groundLevel??0)+(target.platformY??0):0;
  target[axis]=Math.fround(type==='posset'?origin+value:(target[axis]??0)+value*(axis==='x'?target.facing:1));
 }
 return true;
}
