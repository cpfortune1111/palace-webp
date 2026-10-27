export function nativeEnemyEligible(source,target){
 const sourceSide=source.teamSide??source.player,targetSide=target.teamSide??target.player;
 return targetSide>0&&targetSide!==sourceSide&&!target.disabled&&!target.standby;
}
export function rootEnemyList(source,roots,{near=false,distance=(source,target)=>Math.abs((target.x??0)-(source.x??0))}={}){
 const enemies=roots.filter(target=>target.kind!=='helper'&&nativeEnemyEligible(source,target));
 if(near)enemies.sort((first,second)=>Math.abs(distance(source,first))-Math.abs(distance(source,second))||(first.instanceId??first.id??first.player)-(second.instanceId??second.id??second.player));
 return enemies;
}
export function p2EnemyList(source,actors,{depth=false,worldUnitScale=1}={}){
 const distance=target=>{let horizontal=Math.fround(((target.x??0)-(source.x??0))*(source.facing??1));if(horizontal<0)horizontal=Math.fround(horizontal-30*worldUnitScale);return depth?Math.fround(Math.hypot(horizontal,Math.fround(((target.z??0)-(source.z??0))*4))):Math.abs(horizontal)};
 return actors.filter(target=>(target.kind!=='helper'||target.helperType===2)&&nativeEnemyEligible(source,target)&&!target.overKo).sort((first,second)=>distance(first)-distance(second)||(first.instanceId??first.id??first.player)-(second.instanceId??second.id??second.player));
}
