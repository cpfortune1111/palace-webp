export function applyStatePersistence(definition,api){
 const retained={};
 for(const [field,clear] of [['hitcountpersist','clearHitCount'],['movehitpersist','clearMoveHit'],['hitdefpersist','clearHitDef']]){
  const expression=definition?.[field];
  const keep=expression===undefined?false:Number(api.evaluate(expression))!==0;
  retained[field]=keep?1:0;
  if(!keep)api[clear]();
 }
 return retained;
}
