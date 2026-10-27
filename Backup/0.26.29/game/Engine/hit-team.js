export function compileHitAffectTeam(value='E'){
 const mode={E:1,F:-1,B:0}[String(value).trim()[0]?.toUpperCase()];
 if(mode===undefined)throw Error('Invalid HitDef affectteam');
 return mode;
}
export function hitTeamAllowed(params,sourceSide,targetSide){
 const mode=compileHitAffectTeam(params.affectteam);
 return mode===0||mode>0&&sourceSide!==targetSide||mode<0&&sourceSide===targetSide;
}
