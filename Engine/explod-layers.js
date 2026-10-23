import {controllerBoolean} from './controller-value-conversion.js';

export function applyExplodLayers(effect,params,inheritedLayer,evaluate,ownerId){
 const integer=expression=>{const sampled=evaluate(expression);return typeof sampled==='string'||sampled===undefined||Number.isNaN(Number(sampled))?0:Math.trunc(Number(sampled))|0};
 effect.layerno=inheritedLayer;
 if(params.synclayer!==undefined)effect.syncLayer=integer(params.synclayer);
 if(params.syncparams!==undefined)effect.syncParams=controllerBoolean(evaluate(params.syncparams));
 if(params.syncid!==undefined){const id=integer(params.syncid);effect.syncId=id===-1?ownerId:id}
 if(params.ontop!==undefined){
  effect.ontop=controllerBoolean(evaluate(params.ontop));
  effect.layerno=effect.ontop?1:0;
  if(effect.ontop)effect.sprpriority=0;
 }
 if(params.under!==undefined)effect.under=controllerBoolean(evaluate(params.under));
 if(params.layerno!==undefined){
  const layer=integer(params.layerno);
  effect.layerno=layer>0?1:layer<0?-1:0;
 }
}

export function synchronizeExplodPriorityFacing(effect,findActor,{trans,palette,transform,register,window,shear}={}){
 if(!(effect.syncId>0))return false;
 const target=findActor(effect.syncId);
 if(!target||target.kind==='projectile')return false;
 if(register)register(target,effect.syncId);
 if(effect.syncParams!==false){
  effect.sprpriority=target.sprPriority;
  effect.facing=target.facing;
  if(trans){const value=trans(target);effect.transState=value?{type:value.type,alpha:[...value.alpha]}:null}
  if(palette)effect.syncedPalFx=palette(target);
  if(window)effect.window=[...window(target)];
  if(shear)effect.xshear=shear(target);
  if(transform){const value=transform(target);effect.scale=[...value.scale];effect.angleState={...value.angleState,scale:[...value.angleState.scale],pivot:[...value.angleState.pivot]}}
 }
 return true;
}
