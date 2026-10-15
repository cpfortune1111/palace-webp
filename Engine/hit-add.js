export function applyHitAddController(controller,caller,api){
 if(String(controller.type).toLowerCase()!=='hitadd')return false;
 const params=controller.params||{};
 if(params.value===undefined)throw Error('Missing HitAdd value');
 const integer=value=>Math.trunc(Number(api.evaluate(value)))|0;
 const owner=params.redirectid===undefined?caller:api.findActor(integer(params.redirectid));
 if(!owner)return true;
 const amount=integer(params.value);
 if(amount===0)return true;
 const source=api.counters(owner);
 source.hitCount=((source.hitCount|0)+amount)|0;
 source.uniqHitCount=((source.uniqHitCount|0)+amount)|0;
 const targets=api.targets(owner),side=api.teamSide(owner);
 const add=target=>{
  const counters=api.counters(target);
  counters.receivedHits=((counters.receivedHits|0)+amount)|0;
  api.addComboHits(side,amount);
 };
 if(targets.length){
  for(const id of targets){const target=api.findActor(id);if(target){add(target);break}}
 }else if(side!==-1){
  for(const target of api.opponents(side))if((api.counters(target).receivedHits|0)!==0||target.moveType==='H')add(target);
 }
 return true;
}
