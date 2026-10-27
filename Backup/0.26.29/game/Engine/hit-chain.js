const integer=value=>Math.trunc(Number(value))|0;

export function compileHitChain(params,{evaluate=Number,split=value=>String(value).split(',')}={}){
 const result={};
 if(params.attr!==undefined||params['reversal.attr']!==undefined)result.id=params.id===undefined?0:Math.max(0,integer(evaluate(params.id)));
 if(params.chainid!==undefined)result.chainid=integer(evaluate(params.chainid));
 if(params.nochainid!==undefined){const components=split(params.nochainid);if(components.length>8||components.some(value=>String(value).trim()===''))throw Error('Invalid nochainid component count');result.nochainid=components.map(value=>integer(evaluate(value))).join(',')}
 return result;
}

export function hitChainAllowed(params,hit,{sourceId,lastTargetOwner,hitShake=0}={}){
 const chain=integer(params.chainid??-1);
 if(chain>=0&&integer(hit.hitid??-1)!==chain)return false;
 if(lastTargetOwner===sourceId||hitShake>0){
  const blocked=String(params.nochainid??'').split(',').filter(value=>value.trim()!=='').map(integer);
  if(integer(hit.playerid??-1)===sourceId&&blocked.some(value=>value>=0&&value===integer(hit.hitid??-1)))return false;
 }
 return true;
}
