const present=value=>value!==undefined&&value!==null&&!(typeof value==='string'&&!value.trim());
const integer=value=>Math.trunc(Number(value))|0;

export function applyStateDefPriority(definition,api){
 if(!present(definition?.sprpriority))return false;
 api.setPriority(integer(api.evaluate(definition.sprpriority)));
 return true;
}

export function applyStateDefControlPower(definition,api){
 if(present(definition?.ctrl))api.setControl(Number(api.evaluate(definition.ctrl))!==0);
 if(present(definition?.poweradd)){
  const amount=integer(api.evaluate(definition.poweradd));
  if(amount!==0)api.addPower(amount);
 }
}
