export function applyVariableController(controller, binding, evaluate){
 const type=controller.type.toLowerCase();
 if(type!=='varset'&&type!=='varadd')return false;
 const params=controller.params||controller;
 let kind,indexExpression;
 const target=String(params.target||'').match(/^(sysvar|sysfvar|fvar|var)\((.*)\)$/i);
 if(target){kind=target[1].toLowerCase();indexExpression=target[2]}
 else if(params.fv!==undefined){kind='fvar';indexExpression=params.fv}
 else if(params.v!==undefined){kind='var';indexExpression=params.v}
 else throw Error('Missing variable controller target');
 const variables=binding[{var:'vars',fvar:'fvars',sysvar:'sysvars',sysfvar:'sysfvars'}[kind]];
 if(!variables)throw Error('Missing '+kind+' storage');
 const index=Math.trunc(Number(evaluate(indexExpression)));
 if(!Number.isFinite(index)||index<0||index>=variables.length)return true;
 const result=Number(evaluate(params.value));
 const floating=kind==='fvar'||kind==='sysfvar';
 const value=floating?result:Math.trunc(result);
 variables[index]=type==='varadd'?variables[index]+value:value;
 return true;
}
