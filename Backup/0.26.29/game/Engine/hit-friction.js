export function hitFrictionValue(getHit,constants,physics){
 const key=physics==='C'?'crouch.friction':'stand.friction',override=getHit?.[key];
 return override!==undefined&&override!==null&&!Number.isNaN(Number(override))?Number(override):Number(constants['movement.'+key]??(physics==='C'?0.82:0.85));
}

export function movementHitFriction(actor,constants,physics){
 return hitFrictionValue(actor.moveType==='H'?actor.getHit:undefined,constants,physics);
}
