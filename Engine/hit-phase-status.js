export function createHitPhaseStatus(){
 let tick=null;
 const gettingHit=new Set();
 return {
  begin(next){if(tick!==next){tick=next;gettingHit.clear()}},
  mark:key=>gettingHit.add(key),
  has:key=>gettingHit.has(key),
  snapshot:()=>({tick,gettingHit:[...gettingHit]}),
  restore(snapshot){tick=snapshot.tick;gettingHit.clear();for(const key of snapshot.gettingHit)gettingHit.add(key)},
  clear(){tick=null;gettingHit.clear()}
 };
}
