import {controllerBoolean} from './controller-value-conversion.js';

export function applyStatusController(controller,caller,api){
 const field={dizzyset:'dizzy',guardbreakset:'guardBreak'}[String(controller.type).toLowerCase()];
 if(!field)return false;
 const params=controller.params||{};
 if(params.value===undefined)throw Error('Missing '+controller.type+' value');
 let target=caller;
 if(params.redirectid!==undefined){const value=api.evaluate(params.redirectid),id=typeof value==='string'||value===undefined||Number.isNaN(Number(value))?0:Math.trunc(Number(value))|0;target=api.findActor(id)}
 if(!target)return true;
 api.setFlag(target,field,controllerBoolean(api.evaluate(params.value)));
 return true;
}
