import {controllerFloat32} from './controller-value-conversion.js';

export function applyStateDefVelocity(definition,api){
 const source=definition?.velset;
 if(source===undefined||source===null||typeof source==='string'&&!source.trim())return false;
 const expressions=Array.isArray(source)?source:api.expressions(String(source));
 if(expressions.length>3)throw Error('StateDef velset expects at most three components');
 if(expressions.some(value=>value===undefined||value===null))throw Error('StateDef velset has an empty component');
 for(const [index,expression]of expressions.entries())api.setVelocity(['x','y','z'][index],controllerFloat32(api.evaluate(expression)));
 return expressions.length>0;
}
