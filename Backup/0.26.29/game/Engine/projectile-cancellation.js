export function consumeProjectileCancellation(projectile,opponent){
 projectile.priorityPoints??=projectile.priority??1;opponent.priorityPoints??=opponent.priority??1;
 projectile.remainingHits??=Math.trunc(Number(projectile.params?.projhits??1))|0;
 if(projectile.priorityPoints>opponent.priorityPoints)projectile.priorityPoints--;
 else projectile.remainingHits--;
 const canceled=projectile.remainingHits<=0,pause=projectile.activeHitDef?.params?.pausetime??projectile.params?.pausetime??0;
 projectile.hitPause=canceled?0:Math.max(0,Math.trunc(Number(String(pause).split(',')[0]))|0);
 return canceled;
}

export function cancelProjectilePair(first,second){
 const firstCanceled=consumeProjectileCancellation(first,second),secondCanceled=consumeProjectileCancellation(second,first);
 return [firstCanceled,secondCanceled];
}

export function sortedProjectileCandidates(projectile,candidates){
 const distance=other=>{const dx=Math.fround(projectile.x-other.x),dy=Math.fround(projectile.y-other.y),dz=Math.fround((projectile.z??0)-(other.z??0));return Math.fround(Math.fround(Math.fround(dx*dx)+Math.fround(dy*dy))+Math.fround(dz*dz))};
 return [...candidates].sort((first,second)=>distance(first)-distance(second)||first.id-second.id);
}

export function projectileTeamCanTrade(first,second){
 const affect=projectile=>{const value=projectile.activeHitDef?.params?.affectteam??projectile.params?.affectteam??'E',mode={E:1,F:-1,B:0}[String(value).trim()[0]?.toUpperCase()];if(mode===undefined)throw Error('Invalid projectile affectteam');return mode};
 const firstMode=affect(first),secondMode=affect(second),friendly=(first.teamSide??first.player)===(second.teamSide??second.player);
 return !(firstMode>0&&secondMode>0&&friendly)&&!(firstMode<0&&secondMode<0&&!friendly);
}
