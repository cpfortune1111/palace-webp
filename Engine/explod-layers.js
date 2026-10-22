import {controllerBoolean} from './controller-value-conversion.js';

export function applyExplodLayers(effect,params,inheritedLayer,evaluate,ownerId){
 const integer=expression=>{const sampled=evaluate(expression);return typeof sampled==='string'||sampled===undefined||Number.isNaN(Number(sampled))?0:Math.trunc(Number(sampled))|0};
 effect.layerno=inheritedLayer;
 if(params.synclayer!==undefined)effect.syncLayer=integer(params.synclayer);
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
