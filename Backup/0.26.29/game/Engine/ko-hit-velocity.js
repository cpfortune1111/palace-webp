export function applyKoHitVelocity(hit,profile,{aerial=false,lying=false,disabled=false}={}){
 hit.xveladd=0;hit.yveladd=0;
 if(disabled||lying||profile.enabled===false)return;
 const startX=Math.fround(hit.xvel),startY=Math.fround(hit.yvel),addition=aerial?profile.airAdd:profile.groundAdd;
 let horizontal=startX,vertical=startY;
 if(!aerial&&vertical===0)horizontal=Math.fround(horizontal*Math.fround(profile.groundXMultiplier));
 if(horizontal!==0)horizontal=Math.fround(horizontal-Math.fround(Math.fround(addition[0])*Math.sign(horizontal)));
 if(vertical<=0)vertical=Math.min(Math.fround(vertical+Math.fround(addition[1])),Math.fround(aerial?profile.airYMinimum:profile.groundYMinimum));
 hit.xvel=horizontal;hit.yvel=vertical;
 hit.xveladd=Math.fround(horizontal-startX);hit.yveladd=Math.fround(vertical-startY);
}
