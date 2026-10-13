export function applyStatusController(controller,caller,api){
 const field={dizzyset:'dizzy',guardbreakset:'guardBreak'}[String(controller.type).toLowerCase()];
 if(!field)return false;
 const params=controller.params||{};
 if(params.value===undefined)throw Error('Missing '+controller.type+' value');
 const target=params.redirectid===undefined?caller:api.findActor(Math.trunc(Number(api.evaluate(params.redirectid)))|0);
 if(!target)return true;
 api.setFlag(target,field,Number(api.evaluate(params.value))!==0);
 return true;
}