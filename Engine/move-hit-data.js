export function createMoveHitData(){return {power:0,'cornerpush.veloff':0,frame:false,overridden:false,playerid:0,playerno:0,sparkx:0,sparky:0}}

export function markMoveHitData(data,target,{overridden=false}={}){data.frame=true;data.playerid=target.playerid;data.playerno=target.playerno;data.overridden=overridden;return data}
export function finishMoveHitData(data,{paused=false}={}){if(!paused)data.frame=false;return data}

export function getMoveHitVar(data,name,{ratio=1,uniqueTargets=0}={}){
 if(name==='id')name='playerid';
 if(name==='frame'||name==='overridden')return {handled:true,value:Number(!!data[name])};
 if(name==='playerid'||name==='power')return {handled:true,value:Math.trunc(Number(data[name]??0))|0};
 if(name==='playerno')return {handled:true,value:(Math.trunc(Number(data.playerno??0))|0)+1};
 if(name==='uniqhit')return {handled:true,value:Math.trunc(Number(uniqueTargets))|0};
 if(name==='cornerpush.veloff')return {handled:true,value:Math.fround(Number(data[name]??0))};
 if(name==='sparkx'||name==='sparky')return {handled:true,value:Math.fround(Math.fround(data[name]??0)*Math.fround(ratio))};
 return {handled:false};
}
