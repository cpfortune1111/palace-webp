export function applyVariableController(controller, binding, evaluate, options={}){
 const originalType=controller.type.toLowerCase();
 const ownership=originalType.startsWith('parentvar')?'parent':originalType.startsWith('rootvar')?'root':null;
 const type=ownership?originalType.replace(ownership,''):originalType;
 if(!['varset','varadd','varrandom','varrangeset'].includes(type))return false;
 const params=controller.params||controller;
 if(params.redirectid!==undefined){binding=options.findActor?.(Math.trunc(Number(evaluate(params.redirectid))));if(!binding)return true}
 const integer=expression=>Math.trunc(Number(evaluate(expression)))|0;
 const unlimited=options.compatibility==='ikemen';
 if(type==='varrangeset'){
  const floating=params.fvalue!==undefined,variables=floating?binding.fvars:binding.vars;
  if(!variables)throw Error('Missing VarRangeSet storage');
  const first=integer(params.first??0),last=integer(params.last??(unlimited?59:variables.length-1));
  if(first<0||first>last)return true;
  const expression=floating?params.fvalue:params.value;
  if(expression===undefined)throw Error('Missing VarRangeSet value');
  const value=floating?Math.fround(Number(evaluate(expression))):integer(expression);
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
  if(index>=0&&(unlimited||index<binding.vars.length))binding.vars[index]=first+Math.floor((options.random||Math.random)()*(last-first+1));
  return true;
 }
 let kind,indexExpression;
 const target=String(params.target||'').match(/^(sysvar|sysfvar|fvar|var)\((.*)\)$/i);
 if(target){kind=target[1].toLowerCase();indexExpression=target[2]}
 else if(params.fv!==undefined){kind='fvar';indexExpression=params.fv}
 else if(params.v!==undefined){kind='var';indexExpression=params.v}
 else throw Error('Missing variable controller target');
 const index=Math.trunc(Number(evaluate(indexExpression)));
 if(params.value===undefined)throw Error('Missing variable controller value');
 const result=Number(evaluate(params.value));
 if(ownership)binding=ownership==='parent'?options.parentActor?.(binding):options.rootActor?.(binding);
 if(!binding)return true;
 const variables=binding[{var:'vars',fvar:'fvars',sysvar:'sysvars',sysfvar:'sysfvars'}[kind]];
 if(!variables)throw Error('Missing '+kind+' storage');
 if(!Number.isFinite(index)||index<0||!unlimited&&index>=variables.length)return true;
 const floating=kind==='fvar'||kind==='sysfvar';
 const value=floating?Math.fround(result):Math.trunc(result)|0;
 const combined=type==='varadd'?(variables[index]||0)+value:value;
 variables[index]=floating?Math.fround(combined):combined|0;
 return true;
}
