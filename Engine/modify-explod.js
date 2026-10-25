import {controllerInteger,controllerFloat32,controllerBoolean} from './controller-value-conversion.js';
import {sampleExplodRandom} from './explod-random.js';
import {readModifyExplodFacing,readModifyExplodLayers} from './modify-explod-visuals.js';
import {compileTransParameters} from './trans-controller.js';

export function applyModifyExplodController(controller,caller,api){
 if(String(controller.type).toLowerCase()!=='modifyexplod')return false;
 const params=controller.params??{};
 for(const name of Object.keys(params))if(!['id','index','redirectid','postype','pos','random','vel','velocity','friction','accel','scale','facing','vfacing','removetime','supermove','supermovetime','pausemovetime','sprpriority','layerno','ontop','under','trans','alpha','removeongethit','removeonchangestate','persistent','ignorehitpause'].includes(name))throw Error('Unsupported ModifyExplod parameter: '+name);
 const integer=expression=>controllerInteger(api.evaluate(expression)),owner=params.redirectid===undefined?caller:api.findActor(integer(params.redirectid));if(!owner)return true;
 const id=params.id===undefined?-1:integer(params.id),index=params.index===undefined?-1:integer(params.index),effects=api.select(owner,id,index);if(!effects.length)return true;
 const ikemen=api.ikemenVersion(caller),postype=params.postype===undefined?null:String(params.postype).trim().toLowerCase();if(postype!==null&&postype!=='p1')throw Error('Unsupported ModifyExplod postype '+postype);
 const locked=!ikemen&&postype===null,scale=Math.fround(api.localScale(caller)/api.localScale(owner));
 const facing=readModifyExplodFacing(params,{evaluate:api.evaluate,locked});
 const vector=(expression,maximum,ratio)=>{if(expression===undefined)return null;const parts=api.split(expression);if(!parts.length||parts.length>maximum)throw Error('Invalid ModifyExplod vector');return parts.map(value=>Math.fround(controllerFloat32(api.evaluate(value))*ratio))};
 const position=locked?null:vector(params.pos,3,scale),spread=locked?[0,0,0]:sampleExplodRandom(params.random,{...api,scale}),velocity=locked?null:vector(params.velocity??params.vel,3,scale),friction=vector(params.friction,3,1),accel=locked?null:vector(params.accel,3,scale),spriteScale=vector(params.scale,2,1);
 const removeTime=params.removetime===undefined?null:integer(params.removetime),pauseTimes={};
 if(params.supermove!==undefined)pauseTimes.supermovetime=controllerBoolean(api.evaluate(params.supermove))?-1:0;
 for(const name of ['supermovetime','pausemovetime'])if(params[name]!==undefined)pauseTimes[name]=integer(params[name]);
 const visuals={...facing,...readModifyExplodLayers(params,api)};
 const removeOnGetHit=params.removeongethit===undefined?null:controllerBoolean(api.evaluate(params.removeongethit));
 const removeOnChangeState=params.removeonchangestate===undefined?null:controllerBoolean(api.evaluate(params.removeonchangestate));
 const compiledTrans=compileTransParameters(params,{mugen:!ikemen,split:api.split}),transState=compiledTrans?{type:compiledTrans.type,alpha:compiledTrans.alpha.map(value=>Math.max(0,Math.min(255,controllerInteger(api.evaluate(value)))))}:null;
 const ignoreHitPause=params.ignorehitpause===undefined?null:controllerBoolean(api.evaluate(params.ignorehitpause));
 const positionActive=postype!==null||position!==null||!locked&&params.random!==undefined;
 if(!positionActive&&!velocity&&!friction&&!accel&&!spriteScale&&removeTime===null&&!Object.keys(pauseTimes).length&&!Object.keys(visuals).length&&!transState&&ignoreHitPause===null&&removeOnGetHit===null&&removeOnChangeState===null)return true;
 for(const effect of effects)api.modify(effect,owner,{spread,postype,position,velocity,friction:friction?[friction[0],friction[1]??0,friction[2]??0]:null,accel,spriteScale,removeTime,pauseTimes,positionActive,visuals,transState,ignoreHitPause,removeOnGetHit,removeOnChangeState,ikemen,legacyReset:!ikemen&&postype!==null});
 return true;
}
