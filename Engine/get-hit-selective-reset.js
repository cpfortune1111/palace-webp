const preserved=['guardko','damage','dizzypoints','down.recovertime','fallcount','fall','frame','guardcount','guarddamage','guardpoints','guardpower','targetedBy','hitcount','hitdamage','hitpower','kill','power'];

export function selectiveGetHitReset(previous={}, {localCoord=1280,gameWidth=320,legacyFall=false}={}){
 const origin=legacyFall?1:Math.fround(Math.fround(320/localCoord)*Math.fround(320/gameWidth)),result={hittime:-1,yaccel:Math.fround(0.35/origin),xoff:previous.xoff??0,yoff:previous.yoff??0,zoff:previous.zoff??0,hitid:-1,playerno:-2,playerid:-1,projid:-1,teamside:-2,'fall.xvel':null,'fall.yvel':Math.fround(-4.5/origin),'fall.zvel':null,'stand.friction':NaN,'crouch.friction':NaN};
 for(const name of preserved)if(previous[name]!==undefined)result[name]=previous[name];
 for(const name of ['time','freq','ampl','phase','mul','dir','diradd','decay'])result['fall.envshake.'+name]=0;
 return result;
}
