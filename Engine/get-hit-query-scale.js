const scaled=new Set(['xoff','yoff','zoff','xvel','yvel','zvel','xaccel','yaccel','zaccel','xveladd','yveladd','fall.xvel','fall.yvel','fall.zvel','fall.envshake.ampl']);

export function getHitQueryScale(hit,name,ratio){
 if(!scaled.has(name))return {handled:false};
 const value=hit[name];
 if((name==='fall.xvel'||name==='fall.zvel')&&(value===null||Number.isNaN(value)))return {handled:true,value:-32760};
 if(value===undefined)return {handled:false};
 const converted=Math.fround(Math.fround(Number(value))*Math.fround(ratio));
 return {handled:true,value:name==='fall.envshake.ampl'?Math.trunc(converted)|0:converted};
}
