export function applyHitScoreContact(params,hit,{guarded=false,sourceExcluded=false,targetExcluded=false,playerType=true,addSource,addTarget}={}){
 if(guarded||params.score===undefined)return false;
 const values=String(params.score).split(',').map(value=>Math.fround(Number(value)));
 if(!sourceExcluded&&!Number.isNaN(values[0])){addSource(values[0]);hit.score=values[0]}
 if(playerType&&!targetExcluded&&values[1]!==undefined&&!Number.isNaN(values[1]))addTarget(values[1]);
 return true;
}

export function resetIdleHitScore(hit,{moveType,hitPause=false,dizzy=false}){
 if(!hitPause&&moveType!=='H'&&!dizzy)hit.score=0;
 return hit;
}
