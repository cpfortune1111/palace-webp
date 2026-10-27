import {selectiveGetHitReset} from './get-hit-selective-reset.js';

export function reversalHitData(previous,definition,source,{ratio=1,airborne=false,defaultDownRecovery,resetOptions}={}){
 const hit=selectiveGetHitReset(previous,resetOptions);
 for(const name of ['playerno','playerid','teamside'])hit[name]=source[name];
 hit.attr=definition.attr;hit.hitid=definition.id;hit['fall.time']=0;
 if(definition.forcenofall)hit.fall=false;else if(!hit.fall)hit.fall=airborne?!!definition['air.fall']:!!definition.fall;
 for(const name of ['fall.animtype','fall.recover','fall.recovertime','fall.damage','fall.kill','fall.envshake.time','fall.envshake.freq','fall.envshake.phase','fall.envshake.mul','fall.envshake.dir','down.recover'])if(definition[name]!==undefined)hit[name]=definition[name];
 for(const name of ['fall.xvel','fall.yvel','fall.zvel'])if(definition[name]!==undefined)hit[name]=definition[name]===null?null:Math.fround(Math.fround(definition[name])*Math.fround(ratio));
 if(definition['fall.envshake.ampl']!==undefined)hit['fall.envshake.ampl']=Math.trunc(Math.fround(Math.fround(definition['fall.envshake.ampl'])*Math.fround(ratio)))|0;
 if(definition['down.recovertime']!==undefined){if(definition['down.recovertime']<0&&defaultDownRecovery===undefined)throw Error('Missing native liedown recovery default');hit['down.recovertime']=definition['down.recovertime']<0?defaultDownRecovery:definition['down.recovertime']}
 return hit;
}
