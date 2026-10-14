export function keepStateHitData(previous,incoming){
 const result={hittime:-1,hitshaketime:0,animtype:0,xvel:0,yvel:0,zvel:0,guarded:false,fall:0,...(previous||{})};
 for(const name of ['hitid','playerno','playerid','teamside','projid','groundtype','airtype','type','kill','damage','frame','guardko'])if(incoming[name]!==undefined)result[name]=incoming[name];
 result.keepstate=true;
 return result;
}
