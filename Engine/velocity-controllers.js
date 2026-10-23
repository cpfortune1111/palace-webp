import {controllerFloat32,controllerBoolean,controllerInteger} from './controller-value-conversion.js';

const types=new Set(['velset','veladd','velmul','hitvelset']);

export function applyVelocityController(controller,actor,api){
 const type=controller.type.toLowerCase();
 if(!types.has(type))return false;
 const params=controller.params||controller;
 const target=params.redirectid===undefined?actor:api.findActor(controllerInteger(api.evaluate(params.redirectid)));
 if(!target)return true;
 if(type==='hitvelset'){
  for(const axis of ['x','y','z'])if(params[axis]!==undefined&&controllerBoolean(api.evaluate(params[axis]))){
   target['v'+axis]=Math.fround((target.getHit?.[axis+'vel']??0)*(axis==='x'?target.facing:1));
  }
  return true;
 }
 const ratio=Math.fround((actor.localScale??1)/(target.localScale??1));
 for(const axis of ['x','y','z'])if(params[axis]!==undefined){
  const field='v'+axis,input=controllerFloat32(api.evaluate(params[axis]));
  const value=type==='velmul'?input:Math.fround(input*ratio);
  target[field]=Math.fround(type==='velset'?value:type==='veladd'?(target[field]??0)+value:(target[field]??0)*value);
 }
 return true;
}
