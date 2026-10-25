import {controllerFloat32} from './controller-value-conversion.js';

export function deferModifyExplodWindow(expression,{evaluate,split,warn=message=>console.warn(message),scale=1}){
 if(expression===undefined)return null;
 const parts=split(expression);if(parts.length>4)throw Error('ModifyExplod window expects at most four values');
 if(parts.length<4){warn('invalid explod window');return null}
 return write=>{const values=[];for(const [axis,expression] of parts.entries()){const value=Math.fround(controllerFloat32(evaluate(expression))*scale);values.push(value);write?.(axis,value)}return values};
}
export function readModifyExplodGeometry(params,{evaluate}){
 const values={};for(const name of ['angle','yangle','xangle','xshear'])if(params[name]!==undefined)values[name]=controllerFloat32(evaluate(params[name]));return values;
}
