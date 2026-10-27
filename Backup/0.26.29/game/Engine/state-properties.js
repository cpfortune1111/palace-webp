import {controllerBoolean,controllerInteger} from './controller-value-conversion.js';

export function applyStatePropertyController(controller,actor,api){
 const type=controller.type.toLowerCase();
 if(!['ctrlset','statetypeset','turn','sprpriority'].includes(type))return false;
 const params=controller.params||controller;
 const number=expression=>{const value=api.evaluate(expression);return typeof value==='string'||value===undefined||Number.isNaN(Number(value))?0:Number(value)};
 const target=params.redirectid===undefined?actor:api.findActor(controllerInteger(api.evaluate(params.redirectid)));
 if(!target)return true;
 if(type==='sprpriority'){
  const layer=params.layerno===undefined?0:Math.trunc(number(params.layerno))|0;
  const priority=params.value===undefined?0:Math.trunc(number(params.value))|0;
  target.sprPriority=priority;
  target.layerNo=layer;
  return true;
 }
 if(type==='turn'){
  const velocity=target.vx;
  target.facing=-target.facing;
  target.vx=-velocity;
  return true;
 }
 if(type==='ctrlset'){
  if(params.value===undefined)throw Error('Missing CtrlSet value');
  target.ctrl=controllerBoolean(api.evaluate(params.value))?1:0;
  return true;
 }
 const fields=[['type',params.statetype??params.value,'SCAL'],['moveType',params.movetype??params.moveType,'IAH'],['physics',params.physics,'SCAN']];
 const changes=[];
 for(const [field,input,allowed] of fields)if(input!==undefined){
  const value=String(input).trim().toUpperCase()[0];
  if(!value||!allowed.includes(value))throw Error('Invalid StateTypeSet '+field);
  changes.push([field,value]);
 }
 for(const [field,value] of changes)target[field]=value;
 return true;
}
