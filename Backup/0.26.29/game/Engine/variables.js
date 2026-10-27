import {controllerFloat32} from './controller-value-conversion.js';

function variableInteger(value){return typeof value==='string'||value===undefined||Number.isNaN(Number(value))?0:Math.trunc(Number(value))|0}

export function assignExpressionVariable(binding,family,index,value,{unlimited=false}={}){
 const key={var:'vars',fvar:'fvars',sysvar:'sysvars',sysfvar:'sysfvars'}[family];
 if(!key||!binding?.[key])throw Error('Missing assignment storage '+family);
 const variables=binding[key],slot=variableInteger(index);
 const converted=family.includes('fvar')?controllerFloat32(value):variableInteger(value);
 if(slot<0||!unlimited&&slot>=variables.length)return NaN;
 variables[slot]=converted;
 return converted;
}

export function applyVariableController(controller, binding, evaluate, options={}){
 const originalType=controller.type.toLowerCase();
 const ownership=originalType.startsWith('parentvar')?'parent':originalType.startsWith('rootvar')?'root':null;
 const type=ownership?originalType.replace(ownership,''):originalType;
 if(!['varset','varadd','varrandom','varrangeset'].includes(type))return false;
 const params=controller.params||controller;
 const integer=expression=>variableInteger(evaluate(expression));
 if(params.redirectid!==undefined){binding=options.findActor?.(integer(params.redirectid));if(!binding)return true}
 const unlimited=options.compatibility==='ikemen';
 if(type==='varrangeset'){
  const floating=params.value===undefined&&params.fvalue!==undefined,variables=floating?binding.fvars:binding.vars;
  if(!variables)throw Error('Missing VarRangeSet storage');
  const first=integer(params.first??0),last=integer(params.last??(unlimited?59:variables.length-1));
  const expression=floating?params.fvalue:params.value;
  if(expression===undefined)throw Error('Missing VarRangeSet value');
  const value=floating?controllerFloat32(evaluate(expression)):integer(expression);
  if(first<0||first>last)return true;
  if(unlimited&&value===0){
   const keys=Object.keys(variables).map(Number).filter(index=>Number.isInteger(index)&&index>=first&&index<=last).sort((firstIndex,lastIndex)=>firstIndex-lastIndex);
   const clearingAll=first===0&&last===2147483647;
   for(const index of clearingAll?keys:keys.slice(0,options.maximumLoop??2500))delete variables[index];
   return true;
  }
  const end=unlimited?Math.min(last,first+(options.maximumLoop??2500)-1):Math.min(last,variables.length-1);
  for(let index=first;index<=end;index++)variables[index]=value;
  return true;
 }
 if(type==='varrandom'){
  if(params.v===undefined)throw Error('Missing VarRandom variable index');
  const index=integer(params.v),parts=(options.split||((expression)=>String(expression).split(',')))(params.range??'0,1000');
  if(parts.length===1)parts.unshift('0');
  if(parts.length!==2)throw Error('Invalid VarRandom range');
  const bounds=parts.map(integer),first=Math.min(...bounds),last=Math.max(...bounds);
  const randomized=options.randomInteger?options.randomInteger(bounds[0],bounds[1]):first+Math.floor((options.random||Math.random)()*(last-first+1));
  if(index>=0&&(unlimited||index<binding.vars.length))binding.vars[index]=randomized;
  return true;
 }
 let kind,indexExpression;
 const target=String(params.target||'').match(/^(sysvar|sysfvar|fvar|var)\((.*)\)$/i);
 const selectors=[['v','var'],['fv','fvar'],['sysv','sysvar'],['sysfv','sysfvar']].filter(([name])=>params[name]!==undefined);
 if(selectors.length+(target?1:0)>1)throw Error('VarSet can only set one variable at a time');
 if(target){kind=target[1].toLowerCase();indexExpression=target[2]}
 else if(selectors.length){kind=selectors[0][1];indexExpression=params[selectors[0][0]]}
 else throw Error('Missing variable controller target');
 const index=integer(indexExpression);
 if(params.value===undefined)throw Error('Missing variable controller value');
 const result=evaluate(params.value);
 if(ownership)binding=ownership==='parent'?options.parentActor?.(binding):options.rootActor?.(binding);
 if(!binding)return true;
 const variables=binding[{var:'vars',fvar:'fvars',sysvar:'sysvars',sysfvar:'sysfvars'}[kind]];
 if(!variables)throw Error('Missing '+kind+' storage');
 if(!Number.isFinite(index)||index<0||!unlimited&&index>=variables.length)return true;
 const floating=kind==='fvar'||kind==='sysfvar';
 const value=floating?controllerFloat32(result):variableInteger(result);
 const combined=type==='varadd'?(variables[index]??0)+value:value;
 variables[index]=floating?Math.fround(combined):combined|0;
 return true;
}
