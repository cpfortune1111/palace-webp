import {controllerBoolean,controllerInteger} from './controller-value-conversion.js';

const present=value=>value!==undefined&&value!==null&&!(typeof value==='string'&&!value.trim());

export function applyStateDefPriority(definition,api){
 if(!present(definition?.sprpriority))return false;
 api.setPriority(controllerInteger(api.evaluate(definition.sprpriority)));
 api.setLayer?.(0);
 return true;
}

export function applyStateDefControlPower(definition,api){
 if(present(definition?.ctrl))api.setControl(controllerBoolean(api.evaluate(definition.ctrl)));
 if(present(definition?.poweradd)){
  const amount=controllerInteger(api.evaluate(definition.poweradd));
  if(amount!==0)api.addPower(amount);
 }
}
