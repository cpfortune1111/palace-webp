export function createHitPhaseStatus(){
 let tick=null;
 const gettingHit=new Set();
 return {
  begin(next){if(tick!==next){tick=next;gettingHit.clear()}},
  mark:key=>gettingHit.add(key),
  has:key=>gettingHit.has(key),
  clear(){tick=null;gettingHit.clear()}
 };
}
