export function getHitWriteEligible({gettingHit,stateChangePending,customStateApplied}={}){
 for(const value of [gettingHit,stateChangePending,customStateApplied])if(typeof value!=='boolean')throw Error('Missing native GetHitVar write phase input');
 return !gettingHit||!stateChangePending||customStateApplied;
}
