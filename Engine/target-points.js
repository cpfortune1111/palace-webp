export function targetPointAddition(value,target,{absolute=false,compatibility='mugen'}={}){
 let amount=absolute?value:value/target.finalDefense;
 if(amount>0&&amount<1)amount=1;
 if(amount>=target.life&&(target.life>0||compatibility==='mugen'))amount=target.life-1;
 return Math.max(-2147483648,Math.min(2147483647,Math.sign(amount)*Math.floor(Math.abs(amount)+0.5)))||0;
}

export function applyTargetPointController(controller,caller,api){
 const type=String(controller.type).toLowerCase(),field=type==='targetdizzypointsadd'?'dizzyPoints':type==='targetguardpointsadd'?'guardPoints':null;
 if(!field)return false;
 const params=controller.params||{},integer=value=>Math.trunc(Number(api.evaluate(value)))|0;
 if(params.value===undefined)throw Error('Missing '+controller.type+' value');
 const owner=params.redirectid===undefined?caller:api.findActor(integer(params.redirectid));
 if(!owner)return true;
 const hitId=params.id===undefined?-1:integer(params.id),index=params.index===undefined?-1:integer(params.index),value=integer(params.value),absolute=params.absolute!==undefined&&Number(api.evaluate(params.absolute))!==0;
 if(value===0)return true;
 for(const id of api.targets(owner).select(hitId,index,api.findActor)){
  const target=api.findActor(id);
  if(!target||api.excluded(target,field))continue;
  api.add(target,field,targetPointAddition(value,api.resource(target),{absolute,compatibility:api.compatibility(target)}));
 }
 return true;
}

