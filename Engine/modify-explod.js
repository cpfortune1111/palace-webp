import {controllerInteger,controllerFloat32} from './controller-value-conversion.js';
import {sampleExplodRandom} from './explod-random.js';

export function applyModifyExplodController(controller,caller,api){
 if(String(controller.type).toLowerCase()!=='modifyexplod')return false;
 const params=controller.params??{};
 for(const name of Object.keys(params))if(!['id','index','redirectid','postype','pos','random','vel','velocity','friction','accel','scale','persistent','ignorehitpause'].includes(name))throw Error('Unsupported ModifyExplod parameter: '+name);
 const integer=expression=>controllerInteger(api.evaluate(expression)),owner=params.redirectid===undefined?caller:api.findActor(integer(params.redirectid));if(!owner)return true;
 const id=params.id===undefined?-1:integer(params.id),index=params.index===undefined?-1:integer(params.index),effects=api.select(owner,id,index);if(!effects.length)return true;
 const ikemen=api.ikemenVersion(caller),postype=params.postype===undefined?null:String(params.postype).trim().toLowerCase();if(postype!==null&&postype!=='p1')throw Error('Unsupported ModifyExplod postype '+postype);
 const locked=!ikemen&&postype===null,scale=Math.fround(api.localScale(caller)/api.localScale(owner));
 const vector=(expression,maximum,ratio)=>{if(expression===undefined)return null;const parts=api.split(expression);if(!parts.length||parts.length>maximum)throw Error('Invalid ModifyExplod vector');return parts.map(value=>Math.fround(controllerFloat32(api.evaluate(value))*ratio))};
 const position=locked?null:vector(params.pos,3,scale),spread=locked?[0,0,0]:sampleExplodRandom(params.random,{...api,scale}),velocity=locked?null:vector(params.velocity??params.vel,3,scale),friction=vector(params.friction,3,1),accel=locked?null:vector(params.accel,3,scale),spriteScale=vector(params.scale,2,1);
 const positionActive=postype!==null||position!==null||!locked&&params.random!==undefined;
 if(!positionActive&&!velocity&&!friction&&!accel&&!spriteScale)return true;
 for(const effect of effects)api.modify(effect,owner,{spread,postype,position,velocity,friction:friction?[friction[0],friction[1]??0,friction[2]??0]:null,accel,spriteScale,positionActive,legacyReset:!ikemen&&postype!==null});
 return true;
}
