export function fallRecoveryParameters(params){
 return {'fall.recover':Number(params['fall.recover']??1)!==0,'fall.recovertime':Math.trunc(Number(params['fall.recovertime']??4))|0,'fall.time':0};
}

export function canRecover(getHit){
 return !!getHit?.['fall.recover']&&(getHit['fall.time']??0)>=(getHit['fall.recovertime']??4);
}

export function advanceFallRecovery(getHit,moveType,hitPause){
 if(getHit&&moveType==='H'&&getHit.fall&&!hitPause)getHit['fall.time']=(getHit['fall.time']??0)+1;
}
