export function applyStatePropertyController(controller,actor,api){
 const type=controller.type.toLowerCase();
 if(!['ctrlset','statetypeset'].includes(type))return false;
 const params=controller.params||controller;
 const target=params.redirectid===undefined?actor:api.findActor(Math.trunc(Number(api.evaluate(params.redirectid))));
 if(!target)return true;
 if(type==='ctrlset'){
  if(params.value===undefined)throw Error('Missing CtrlSet value');
  target.ctrl=Number(api.evaluate(params.value))!==0?1:0;
  return true;
 }
 const fields=[['type',params.statetype??params.value,'SCAL'],['moveType',params.movetype??params.moveType,'IAH'],['physics',params.physics,'SCAN']];
 for(const [field,input,allowed] of fields)if(input!==undefined){
  const value=String(input).trim().toUpperCase()[0];
  if(!value||!allowed.includes(value))throw Error('Invalid StateTypeSet '+field);
  target[field]=value;
 }
 return true;
}
