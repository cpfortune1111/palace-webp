export function attackerHitFacing(params,attackerFacing,defenderFacing,guarded,isProjectile=false){
 if(guarded||isProjectile)return attackerFacing;
 const inherit=Math.trunc(Number(params.p1getp2facing??0))|0;
 if(inherit!==0)return inherit<0?-defenderFacing:defenderFacing;
 const turn=Math.trunc(Number(params.p1facing??0))|0;
 return turn<0?-attackerFacing:attackerFacing;
}

export function defenderHitFacing(params,attackerFacing,guarded){
 if(guarded)return null;
 const value=Math.trunc(Number(params.p2facing??0))|0;
 return value===0?null:value<0?attackerFacing:-attackerFacing;
}

export function applyDefenderHitFacing(fighter,facing){
 if(facing!==null)fighter.facing=facing;
}
