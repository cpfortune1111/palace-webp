export const getHitResourceFields=Object.freeze(['damage','redlife','dizzypoints','guardpoints']);
export function prepareGetHitResourceQueue(hit){
 if(!hit.nativeResourceQueue){for(const field of getHitResourceFields)hit[field]=0;hit.nativeResourceQueue=true}
 return hit;
}
export function queueGetHitResources(previous,incoming){
 const result={nativeResourceQueue:true};
 for(const field of getHitResourceFields)result[field]=((previous?.nativeResourceQueue?Number(previous[field]??0):0)+Number(incoming[field]??0))|0;
 return result;
}
export function consumeGetHitResources(hit,{moveType,overrideIndex,apply}={}){
 if(!Number.isInteger(overrideIndex))throw Error('Missing native HitOverride index for resource consumption');
 const eligible=moveType==='H'||!!hit.keepstate&&overrideIndex===-1;
 for(const field of getHitResourceFields){
  const amount=Number(hit[field]??0);
  if(amount===0)continue;
  if(eligible)apply(field,-amount);
  hit[field]=0;
 }
}
