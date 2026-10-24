import {controllerInteger,controllerFloat32,controllerBoolean} from './controller-value-conversion.js';

export function readModifyExplodFacing(params,{evaluate,locked}){
 const result={};if(locked)return result;
 for(const name of ['facing','vfacing'])if(params[name]!==undefined)result[name]=controllerFloat32(evaluate(params[name]))<0?-1:1;
 return result;
}

export function readModifyExplodLayers(params,{evaluate}){
 const result={};
 for(const name of ['sprpriority','layerno','ontop','under'])if(params[name]!==undefined){const value=evaluate(params[name]);result[name]=['ontop','under'].includes(name)?controllerBoolean(value):controllerInteger(value)}
 return result;
}

export function applyModifyExplodVisuals(effect,values,{ikemen,legacyReset=false,previousFacing=(effect.facing??1)*(effect.relativeFacing??1),previousVertical=effect.vfacing??1}){
 if(legacyReset){if(values.facing===undefined&&previousFacing>=0)effect.relativeFacing=1;if(previousVertical>=0)effect.vfacing=1}
 if(values.facing!==undefined&&(ikemen||previousFacing>=0))effect.relativeFacing=values.facing;
 if(values.vfacing!==undefined&&(ikemen||previousVertical>=0))effect.vfacing=values.vfacing;
 if(values.sprpriority!==undefined)effect.sprpriority=values.sprpriority;
 if(values.layerno!==undefined)effect.layerno=Math.sign(values.layerno);
 if(values.ontop===true){effect.ontop=true;effect.layerno=1;effect.sprpriority=0}
 else if(values.ontop===false&&effect.ontop){effect.ontop=false;effect.layerno=0}
 if(values.under===true)effect.under=true;
}
