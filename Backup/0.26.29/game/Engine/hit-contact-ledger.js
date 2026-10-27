const integer=value=>Math.trunc(Number(value))|0;

export function accumulateHitContactLedger(hit,{hitDamage,guardDamage,hitGivePower,guardGivePower,guarded=false,playerType=true}){
 for(const [name,value] of [['hitdamage',hitDamage],['guarddamage',guardDamage],['hitpower',hitGivePower],['guardpower',guardGivePower]])hit[name]=integer(integer(hit[name]??0)+integer(value));
 if(playerType)hit.power=integer(integer(hit.power??0)+integer(guarded?guardGivePower:hitGivePower));
 return hit;
}

export function clearHitContactInformation(hit){
 for(const name of ['hitdamage','guarddamage','hitpower','guardpower'])hit[name]=0;
 return hit;
}

export function commitHitContactPower(hit,addPower){
 const pending=integer(hit.power??0);
 if(pending!==0){addPower(pending);hit.power=0}
 return pending;
}

export function accumulateAttackerContactPower(moveHit,{hitGetPower,guardGetPower,guarded=false}){
 moveHit.power=integer(integer(moveHit.power??0)+integer(guarded?guardGetPower:hitGetPower));
 return moveHit;
}
