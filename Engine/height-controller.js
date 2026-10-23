import {controllerInteger} from './controller-value-conversion.js';
export function applyHeightController(controller,caller,api){
 if(String(controller.type).toLowerCase()!=='height')return false;
 const params=controller.params||{};if(params.value===undefined)throw Error('Missing Height value');
 const owner=params.redirectid===undefined?caller:api.findActor(controllerInteger(api.evaluate(params.redirectid)));if(!owner)return true;
 const scale=Math.fround(api.localCoord(owner)/api.localCoord(caller)),expressions=api.split(params.value);
 const values=[0,0].map((fallback,index)=>expressions[index]===undefined?fallback:Math.fround(Math.fround(Number(api.evaluate(expressions[index])))*scale));
 api.write(owner,values);return true;
}
