const integers=new Set(['hitdamage','guarddamage','hitpower','guardpower','air.animtype','ground.animtype','fall.animtype','type','priority','facing','dizzypoints','guardpoints','playerid','projid','redlife','fallcount','down.recovertime','fall.envshake.time','fall.envshake.ampl']);
const floats=new Set(['fall.envshake.freq','fall.envshake.phase','fall.envshake.mul','fall.envshake.dir','fall.envshake.diradd','fall.envshake.decay']);

export function getHitScalar(hit,name){
 if(name==='id')name='playerid';else if(name==='hitid')name='chainid';else if(name==='recovertime')name='down.recovertime';
 if(name==='chainid')return {handled:true,value:Math.max(0,Math.trunc(Number(hit.hitid??0))|0)};
 if(name==='playerno'||name==='teamside')return {handled:true,value:(Math.trunc(Number(hit[name]??-1))|0)+1};
 if(name==='down.recover'||name==='kill'||name==='guardko'||name==='frame'||name==='keepstate')return {handled:true,value:Number(!!hit[name])};
 if(integers.has(name))return {handled:true,value:Math.trunc(Number(hit[name]??0))|0};
 if(floats.has(name))return {handled:true,value:Math.fround(Number(hit[name]??0))};
 return {handled:false};
}
