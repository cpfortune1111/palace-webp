export function orderedHitContactCandidates(candidates,{distance,id,reversal}){
 const pairs=candidates.map(actor=>({actor,distance:Math.abs(Math.fround(distance(actor))),id:id(actor),reversal:!!reversal(actor)}));
 pairs.sort((first,second)=>Number(second.reversal)-Number(first.reversal)||first.distance-second.distance||first.id-second.id);
 return pairs.map(pair=>pair.actor);
}
