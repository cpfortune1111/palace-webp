import {controllerFloat32} from './controller-value-conversion.js';

const fields=['damage','redlife','dizzypoints','guardpoints'];
export function createAttackState(){return Object.fromEntries(fields.map(field=>[field,1]))}

export function applyAttackController(controller,actor,api){
 if(controller.type.toLowerCase()!=='attackmulset')return false;
 const params=controller.params||controller;
 const target=params.redirectid===undefined?actor:api.findActor(Math.trunc(Number(api.evaluate(params.redirectid))));
 if(!target)return true;
 if(params.value===undefined&&!fields.some(field=>params[field]!==undefined))throw Error('Missing AttackMulSet multiplier');
 if(params.value!==undefined){const value=controllerFloat32(api.evaluate(params.value));for(const field of fields)target.attackState[field]=value}
 for(const field of fields)if(params[field]!==undefined)target.attackState[field]=controllerFloat32(api.evaluate(params[field]));
 return true;
}
