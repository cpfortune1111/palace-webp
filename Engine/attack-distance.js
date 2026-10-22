import {controllerFloat32} from './controller-value-conversion.js';

export function characterGuardDistance(data,{projectile=false}={}){
 const constants={...data.sizeConstants,...data.constants},prefix='size.'+(projectile?'proj.':'')+'attack.dist';
 const original=projectile?data.sizeDefinition?.projectileAttackDistance:data.sizeDefinition?.attackDistance;
 const range=original?{x:[...original.x],y:[...original.y],z:[...original.z]}:{x:projectile?[90,0]:[data.guardDistance?.front??160,data.guardDistance?.back??0],y:[1000,1000],z:projectile?[10,10]:[4,4]};
 if(constants[prefix]!==undefined)range.x[0]=Number(constants[prefix]);
 for(const [name,axis] of [['width','x'],['height','y'],['depth','z']]){
  const value=constants[prefix+'.'+name];
  if(value!==undefined){const values=Array.isArray(value)?value:[value];for(let index=0;index<Math.min(2,values.length);index++)range[axis][index]=Number(values[index])}
  for(const [index,component] of ['x','y'].entries())if(constants[prefix+'.'+name+'.'+component]!==undefined)range[axis][index]=Number(constants[prefix+'.'+name+'.'+component]);
 }
 for(const axis of ['x','y','z'])range[axis]=range[axis].map(value=>Math.fround(value));
 return range;
}

export function applyAttackDistanceController(controller,actor,api){
 if(controller.type.toLowerCase()!=='attackdist')return false;
 const params=controller.params||controller;
 const target=params.redirectid===undefined?actor:api.findActor(Math.trunc(Number(api.evaluate(params.redirectid)))|0);
 if(!target)return true;
 const scale=Math.fround((actor.localScale??1)/(target.localScale??1));
 for(const [parameter,axis] of [['value','x'],['width','x'],['height','y'],['depth','z']]){
  if(params[parameter]===undefined)continue;
  const expressions=api.splitPair(params[parameter]);
  if(expressions.length>2)throw Error('AttackDist '+parameter+' expects at most two values');
  for(let index=0;index<expressions.length;index++)target.hitDef.guardDistance[axis][index]=Math.max(0,Math.fround(controllerFloat32(api.evaluate(expressions[index]))*scale));
 }
 return true;
}

export function withinAttackGuardDistance(attacker,defender,range){
 if(attacker.moveType!=='A')return false;
 const x=(defender.x-attacker.x)*attacker.facing,y=defender.y-attacker.y,z=(defender.z??0)-(attacker.z??0);
 return x<range.x[0]&&x>-range.x[1]&&(y===0||y>-range.y[0]&&y<range.y[1])&&(z===0||z>-range.z[0]&&z<range.z[1]);
}

export function applyHitDefGuardDistance(params,range,api){
 for(const [parameter,axis] of [['guard.dist','x'],['guard.dist.width','x'],['guard.dist.height','y'],['guard.dist.depth','z']]){
  if(params[parameter]===undefined)continue;
  const expressions=api.splitPair(params[parameter]);
  if(expressions.length>2)throw Error('HitDef '+parameter+' expects at most two values');
  const values=expressions.map(expression=>Math.fround(Math.trunc(Number(api.evaluate(expression)))|0));
  if(values.length<2)values.push(0);
  for(let index=0;index<2;index++)if(values[index]>=0)range[axis][index]=values[index];
 }
 return range;
}

export function createProjectileGuardDistance(params,defaults,api){
 const range={x:[...(defaults.x??[90,0])],y:[...(defaults.y??[1000,1000])],z:[...(defaults.z??[10,10])]};
 return applyHitDefGuardDistance(params,range,api);
}
