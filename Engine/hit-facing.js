export function defenderHitFacing(params,attackerFacing,guarded){
 if(guarded)return null;
 const value=Math.trunc(Number(params.p2facing??0))|0;
 return value===0?null:value<0?attackerFacing:-attackerFacing;
}

export function applyDefenderHitFacing(fighter,facing){
 if(facing!==null)fighter.facing=facing;
}
