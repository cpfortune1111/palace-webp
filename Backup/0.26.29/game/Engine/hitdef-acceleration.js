export function hitDefAcceleration(params,{evaluate=Number,localCoord=1280,nativeGameWidth=320,recipientRatio=1,hitFacing=1}={}){
 const origin=Math.fround(Math.fround(320/localCoord)*Math.fround(320/nativeGameWidth)),ratio=Math.fround(recipientRatio),values={x:0,y:Math.fround(0.35/origin),z:0};
 for(const axis of ['x','y','z'])if(params[axis+'accel']!==undefined)values[axis]=Math.fround(Number(evaluate(params[axis+'accel'])));
 return {xaccel:Math.fround(Math.fround(values.x*ratio)*-hitFacing),yaccel:Math.fround(values.y*ratio),zaccel:Math.fround(values.z*ratio)};
}
