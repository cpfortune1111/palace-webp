const types=new Set(['velset','veladd','velmul']);

export function applyVelocityController(controller,actor,api){
 const type=controller.type.toLowerCase();
 if(!types.has(type))return false;
 const params=controller.params||controller;
 const target=params.redirectid===undefined?actor:api.findActor(Math.trunc(Number(api.evaluate(params.redirectid))));
 if(!target)return true;
 if(params.z!==undefined)throw Error('Velocity Z physics is not implemented');
 const ratio=(actor.localScale??1)/(target.localScale??1);
 for(const axis of ['x','y'])if(params[axis]!==undefined){
  const field='v'+axis,input=Math.fround(Number(api.evaluate(params[axis])));
  const value=type==='velmul'?input:Math.fround(input*ratio);
  target[field]=Math.fround(type==='velset'?value:type==='veladd'?target[field]+value:target[field]*value);
 }
 return true;
}
