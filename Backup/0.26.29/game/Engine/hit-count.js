export function hitDefCount(params){
 return Math.trunc(Number(params.numhits??1))|0;
}

export function getHitContactCounts(defender,guarded){
 const previous=defender.getHit||{},inHit=defender.moveType==='H',combo=inHit&&!previous.guarded;
 return {hitcount:guarded?(previous.hitcount??0):combo?(previous.hitcount??0)+1:1,
  guardcount:guarded?(inHit?(previous.guardcount??0):0)+1:(inHit?(previous.guardcount??0):0)};
}
