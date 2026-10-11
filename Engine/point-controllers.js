const integer=value=>Math.trunc(Number(value))|0;
const rounded=value=>Math.sign(value)*Math.floor(Math.abs(value)+0.5);
const fields={dizzypointsadd:'dizzyPoints',dizzypointsset:'dizzyPoints',guardpointsadd:'guardPoints',guardpointsset:'guardPoints'};

export function consumeHitPoints(actor,field,damage,enabled,noDamage){
 if(damage===0)return;
 if(enabled&&!noDamage)actor[field]=Math.max(0,Math.min(actor[field+'Max'],actor[field]-damage));
}

export function applyPointController(controller,actor,api){
 const type=controller.type.toLowerCase(),field=fields[type];
 if(!field)return false;
 const params=controller.params||controller;
 const target=params.redirectid===undefined?actor:api.findActor(integer(api.evaluate(params.redirectid)));
 if(!target)return true;
 if(params.value===undefined)throw Error('Missing '+controller.type+' value');
 const value=integer(api.evaluate(params.value));
 const add=type.endsWith('add');
 if(add&&value===0)return true;
 const absolute=add&&Number(api.evaluate(params.absolute??0))!==0;
 const next=add?Math.max(-2147483648,Math.min(2147483647,target[field]+rounded(absolute?value:value/target.finalDefense))):value;
 if(api.enabled(target,field)&&!api.noDamage(target))target[field]=Math.max(0,Math.min(target[field+'Max'],next));
 return true;
}
