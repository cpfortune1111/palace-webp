export function contactDownRecovery({requested=-1,defaultTime,priorTime,stateType}){
 const limit=Math.trunc(Number(requested))<0?Math.trunc(Number(defaultTime)):Math.trunc(Number(requested));
 if(!Number.isFinite(limit))throw Error('Missing actual down recovery time');
 return stateType==='L'?Math.min(Math.trunc(Number(priorTime??defaultTime)),limit):limit;
}

export function canGetUpFromLieDown(actor,{paused,alive,hit}){
 return !paused&&actor.state===5110&&actor.time>=1&&Number(hit['down.recovertime']??0)<=0&&alive&&!actor.assertions?.has('nogetupfromliedown');
}

export function advanceDownRecovery(hit,{state,paused}){
 if(!paused&&state===5110&&hit['down.recovertime']>0)hit['down.recovertime']--;
}
