const scaled=new Set(['xoff','yoff','zoff','xvel','yvel','zvel','xaccel','yaccel','zaccel','xveladd','yveladd','fall.xvel','fall.yvel','fall.zvel','fall.envshake.ampl']);

export function getHitQueryScale(hit,name,ratio){
 const vector=/^(ground|air|down|guard|airguard)\.velocity\.[xyz]$/.test(name);
 if(!scaled.has(name)&&!vector)return {handled:false};
 const value=hit[name];
 if((name==='fall.xvel'||name==='fall.zvel')&&(value===null||Number.isNaN(value)))return {handled:true,value:-32760};
 if(value===undefined)return vector||name==='xveladd'||name==='yveladd'?{handled:true,value:0}:{handled:false};
 const converted=Math.fround(Math.fround(Number(value))*Math.fround(ratio));
 return {handled:true,value:name==='fall.envshake.ampl'?Math.trunc(converted)|0:converted};
}
