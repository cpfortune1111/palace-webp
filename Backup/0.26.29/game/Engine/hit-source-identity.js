export function hitSourceIdentity(attacker){
 const player=Math.trunc(Number(attacker.player??attacker.id))|0;
 return {playerno:player-1,playerid:attacker.kind==='projectile'?attacker.projectileOwnerId??player:attacker.kind==='helper'?attacker.instanceId??attacker.id:attacker.id??player,teamside:(Math.trunc(Number(attacker.teamSide??player))|0)-1,projid:attacker.kind==='projectile'?Math.trunc(Number(attacker.projectileId??attacker.id))|0:-1};
}
