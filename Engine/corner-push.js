export function calculateCornerPush({velocity,multiplier,sourceId,targets,left,right,superPaused=false,ikemen=false,noCornerPush=false}){
 const unchanged={distance:0,multiplier:1};
 if(velocity===0||superPaused)return unchanged;
 let found=false,pushMultiplier=1;
 for(let index=targets.length-1;index>=0;index--){
  const target=targets[index];
  if(!target.playerType||target.moveType!=='H'||target.sourceId!==sourceId||target.projectileId>=0)continue;
  found=true;
  if(ikemen&&target.hitShake>0)continue;
  pushMultiplier=multiplier<0?target.friction:multiplier;
  const next=target.x+target.velocity;
  if(next>left&&next<right||!target.trackable||!target.screenBound)continue;
  let distance=0;
  if(!noCornerPush){
   const movement=Math.max(left,Math.min(right,next))-target.x;
   if(Math.abs(movement)<Math.abs(velocity))distance=velocity-Math.sign(velocity)*Math.abs(movement);
  }
  return {distance:Math.fround(distance),multiplier:Math.fround(pushMultiplier)};
 }
 return found?{distance:0,multiplier:Math.fround(pushMultiplier)}:{distance:0,multiplier:0};
}
