export function hitOnceParameter(params){
 if(params.hitonce!==undefined)return Number(params.hitonce)!==0;
 const attributes=String(params.attr??'').split(',').slice(1).map(value=>value.trim().toUpperCase());
 return attributes.some(value=>/^[NSH]T$/.test(value));
}

export function consumesHitOnce(params,{isProjectile=false,accepted=false}={}){
 return accepted&&!isProjectile&&hitOnceParameter(params);
}

export function consumeHitOnceContact(hitDef,options){
 if(!hitDef||!consumesHitOnce(hitDef.params,options))return false;
 hitDef.hitOnceSpent=true;
 return true;
}
