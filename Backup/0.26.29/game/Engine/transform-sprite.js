import {controllerFloat32} from './controller-value-conversion.js';

export function applyTransformSprite(controller,caller,api){
 if(String(controller.type).toLowerCase()!=='transformsprite')return false;
 const params=controller.params||{},integer=expression=>{const value=api.evaluate(expression);return typeof value==='string'||value===undefined||Number.isNaN(Number(value))?0:Math.trunc(Number(value))|0};
 const target=params.redirectid===undefined?caller:api.findActor(integer(params.redirectid));
 if(!target)return true;
 for(const name of ['focallength','projection'])if(params[name]!==undefined)throw Error('TransformSprite '+name+' drawing is not implemented');
 if(params.window===undefined&&params.xshear===undefined)throw Error('Must specify at least one TransformSprite parameter');
 if(params.window!==undefined){
  const components=api.split(params.window);
  if(components.length>4)throw Error('TransformSprite window expects at most four values');
  if(components.length<4)api.warn?.('invalid TransformSprite window');
  else{
   const ratio=Math.fround(api.localScale(caller)/api.localScale(target)),window=api.window(target);
   for(let index=0;index<4;index++)window[index]=Math.fround(controllerFloat32(api.evaluate(components[index]))*ratio);
  }
 }
 if(params.xshear!==undefined)api.setShear(target,controllerFloat32(api.evaluate(params.xshear)));
 return true;
}
