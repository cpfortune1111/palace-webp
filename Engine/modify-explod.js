import {controllerInteger,controllerFloat32,controllerBoolean} from './controller-value-conversion.js';
import {sampleExplodRandom} from './explod-random.js';
import {readModifyExplodFacing,readModifyExplodLayers} from './modify-explod-visuals.js?v=02596';
import {compileTransParameters} from './trans-controller.js';
import {readModifyExplodAnimation} from './modify-explod-animation-reference.js';
import {deferModifyExplodWindow,readModifyExplodGeometry} from './modify-explod-geometry.js';
import {readModifyExplodSync} from './modify-explod-sync.js';
import {nativeAfterImageFields,deferredExplodAfterImageWrites} from './native-afterimage.js';

export function applyModifyExplodController(controller,caller,api){
 if(String(controller.type).toLowerCase()!=='modifyexplod')return false;
 const params=controller.params??{};
for(const name of Object.keys(params))if(!nativeAfterImageFields.map(field=>'afterimage.'+field).includes(name)&&!['id','index','redirectid','postype','pos','random','vel','velocity','friction','accel','scale','facing','vfacing','synclayer','syncparams','syncid','bindid','bindtime','removetime','supermove','supermovetime','pausemovetime','sprpriority','layerno','ontop','under','trans','alpha','removeongethit','removeonchangestate','anim','animplayerno','spriteplayerno','animelem','animelemtime','animfreeze','angle','yangle','xangle','xshear','window','persistent','ignorehitpause'].includes(name))throw Error('Unsupported ModifyExplod parameter: '+name);
 const integer=expression=>controllerInteger(api.evaluate(expression)),owner=params.redirectid===undefined?caller:api.findActor(integer(params.redirectid));if(!owner)return true;
 const index=params.index===undefined?-1:integer(params.index),id=params.id===undefined?-1:integer(params.id),effects=api.select(owner,id,index);if(!effects.length)return true;
 const ikemen=api.ikemenVersion(caller),postype=params.postype===undefined?null:String(params.postype).trim().toLowerCase();if(postype!==null&&postype!=='p1')throw Error('Unsupported ModifyExplod postype '+postype);
 const locked=!ikemen&&postype===null,scale=Math.fround(api.localScale(caller)/api.localScale(owner));
 const facing=readModifyExplodFacing(params,{evaluate:api.evaluate,locked});
 const vector=(expression,maximum,ratio)=>{if(expression===undefined)return null;const parts=api.split(expression);if(!parts.length||parts.length>maximum)throw Error('Invalid ModifyExplod vector');return parts.map(value=>Math.fround(controllerFloat32(api.evaluate(value))*ratio))};
 const position=locked?null:vector(params.pos,3,scale),spread=locked?[0,0,0]:sampleExplodRandom(params.random,{...api,scale}),velocity=locked?null:vector(params.vel??params.velocity,3,scale),friction=vector(params.friction,3,1),accel=locked?null:vector(params.accel,3,scale),spriteScale=vector(params.scale,2,1);
 const sync=readModifyExplodSync(params,api),binding={};for(const name of ['bindid','bindtime'])if(params[name]!==undefined)binding[name]=integer(params[name]);
 const removeTime=params.removetime===undefined?null:integer(params.removetime),pauseTimes={};
 if(params.supermove!==undefined)pauseTimes.supermovetime=controllerBoolean(api.evaluate(params.supermove))?-1:0;
 for(const name of ['supermovetime','pausemovetime'])if(params[name]!==undefined)pauseTimes[name]=integer(params[name]);
 const visuals={...facing,...readModifyExplodLayers(params,api)};
 const removeOnGetHit=params.removeongethit===undefined?null:controllerBoolean(api.evaluate(params.removeongethit));
 const removeOnChangeState=params.removeonchangestate===undefined?null:controllerBoolean(api.evaluate(params.removeonchangestate));
 const compiledTrans=compileTransParameters(params,{mugen:!ikemen,split:api.split}),transState=compiledTrans?{type:compiledTrans.type,alpha:compiledTrans.alpha.map(value=>Math.max(0,Math.min(255,controllerInteger(api.evaluate(value)))))}:null;
 const windowWrite=deferModifyExplodWindow(params.window,{...api,scale});
 const afterImageWrites=deferredExplodAfterImageWrites(params,{...api,ikemen,warn:api.warn??(message=>console.warn(message))});
 const animationReference=readModifyExplodAnimation(params,{evaluate:api.evaluate,split:api.split,ikemen});
 const animationControl={};for(const name of ['animelem','animelemtime'])if(params[name]!==undefined)animationControl[name]=integer(params[name]);if(params.animfreeze!==undefined)animationControl.animfreeze=controllerBoolean(api.evaluate(params.animfreeze));
 const geometry=readModifyExplodGeometry(params,api);
 const ignoreHitPause=params.ignorehitpause===undefined?null:controllerBoolean(api.evaluate(params.ignorehitpause));
 const positionActive=postype!==null||position!==null||!locked&&params.random!==undefined;
 if(!afterImageWrites.length&&!positionActive&&!velocity&&!friction&&!accel&&!spriteScale&&removeTime===null&&!Object.keys(pauseTimes).length&&!Object.keys(visuals).length&&!transState&&ignoreHitPause===null&&removeOnGetHit===null&&removeOnChangeState===null&&!Object.keys(animationControl).length&&!animationReference&&!windowWrite&&!Object.keys(geometry).length&&!Object.keys(binding).length&&!Object.keys(sync).length)return true;
 const changes={afterImageWrites,spread,postype,position,velocity,friction:friction?[friction[0],friction[1]??0,friction[2]??0]:null,accel,spriteScale,sync,binding,removeTime,pauseTimes,positionActive,visuals,transState,ignoreHitPause,removeOnGetHit,removeOnChangeState,windowWrite,animationReference,animationControl,geometry,ikemen,legacyReset:!ikemen&&postype!==null};
 if(api.commitBatch)api.commitBatch(effects,owner,changes);
 else{if(windowWrite||afterImageWrites.length)throw Error('ModifyExplod window/afterimage requires a batch commit consumer');for(const effect of effects)api.modify(effect,owner,changes)}
 return true;
}
