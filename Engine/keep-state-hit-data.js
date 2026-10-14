export function keepStateHitData(previous,incoming){
 const result={hittime:-1,hitshaketime:0,animtype:0,xvel:0,yvel:0,zvel:0,guarded:false,fall:0,...(previous||{})};
 for(const name of ['power','hitdamage','guarddamage','hitpower','guardpower','hitid','playerno','playerid','teamside','projid','groundtype','airtype','type','kill','damage','sparkx','sparky','frame','guardko'])if(incoming[name]!==undefined)result[name]=incoming[name];
 result.keepstate=true;
 return result;
}
