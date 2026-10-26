// Inputs are the native tick's already-resolved timers, allowances and source version.
export function commandBufferPolicy({hitPause=false,pauseOnHitPause=1,superTime=0,pauseTime=0,superMoveTime=0,pauseMoveTime=0,superEndBuffer=0,pauseEndBuffer=0,sourceVersions={ikemen:[0,0,0],mugen:[1,0]},helper=false}={}){
 const active=superTime>0?superMoveTime!==0:!(pauseTime>0&&pauseMoveTime===0);
 const bufferedHit=!!hitPause&&Math.fround(pauseOnHitPause)!==0;
 const legacy=!(sourceVersions.ikemen?.[0]??0)&&!(sourceVersions.ikemen?.[1]??0);
 const winBuffer=bufferedHit&&legacy&&sourceVersions.mugen?.[0]!==1;
 const pauseEnd=superTime>0?!active&&superTime<=superEndBuffer:pauseTime>0&&!active&&pauseTime<=pauseEndBuffer;
 return {active,hitPause:bufferedHit,pauseEnd,extra:Number(bufferedHit||pauseEnd)+Number(!!winBuffer),helperRestricted:!!helper&&legacy};
}
