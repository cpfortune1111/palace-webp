const scalarVelocity=['air.gethit.airrecover.back','air.gethit.airrecover.down','air.gethit.airrecover.fwd','air.gethit.airrecover.up','air.gethit.ko.ymin','ground.gethit.ko.xmul','ground.gethit.ko.ymin'];
const pairedVelocity=['air.gethit.airrecover.add','air.gethit.airrecover.mul','air.gethit.groundrecover','air.gethit.ko.add','ground.gethit.ko.add','run.back','run.fwd','runjump.back'];
const horizontalVelocity=['airjump.back.x','airjump.fwd.x','airjump.neu.x','airjump.y','jump.back.x','jump.fwd.x','jump.neu.x','jump.y','runjump.fwd.x','runjump.y','walk.back.x','walk.fwd.x'];
const movement=['airjump.num','airjump.height','yaccel','stand.friction','crouch.friction','stand.friction.threshold','crouch.friction.threshold','air.gethit.groundlevel','air.gethit.groundrecover.ground.threshold','air.gethit.groundrecover.groundlevel','air.gethit.airrecover.threshold','air.gethit.airrecover.yaccel','air.gethit.trip.groundlevel','down.bounce.offset.x','down.bounce.offset.y','down.bounce.yaccel','down.bounce.groundlevel','down.gethit.offset.x','down.gethit.offset.y','down.friction.threshold'];
export const motionConstantNames=new Set([
 ...scalarVelocity.map(name=>'velocity.'+name),
 ...pairedVelocity.flatMap(name=>['x','y'].map(axis=>'velocity.'+name+'.'+axis)),
 ...horizontalVelocity.map(name=>'velocity.'+name),
 ...['walk','run','jump','runjump','airjump'].flatMap(mode=>['up','down'].flatMap(direction=>['x','y','z'].map(axis=>'velocity.'+mode+'.'+direction+'.'+axis))),
 ...movement.map(name=>'movement.'+name)
]);
const dimensionless=new Set(['velocity.air.gethit.airrecover.mul.x','velocity.air.gethit.airrecover.mul.y','velocity.ground.gethit.ko.xmul','movement.stand.friction','movement.crouch.friction']);

export function motionConstant(name,constants,{subjectLocalCoord=1280,expressionLocalCoord=subjectLocalCoord}={}){
 const key=String(name).toLowerCase();
 if(!motionConstantNames.has(key)||!constants||!Object.hasOwn(constants,key))return {handled:false};
 const value=Number(constants[key]);
 if(key==='movement.airjump.num')return {handled:true,value:Math.trunc(value)|0};
 if(dimensionless.has(key))return {handled:true,value:Math.fround(value)};
 if(!(subjectLocalCoord>0&&expressionLocalCoord>0&&Number.isFinite(subjectLocalCoord)&&Number.isFinite(expressionLocalCoord)))throw Error('Invalid motion constant coordinates');
 const ratio=Math.fround(Math.fround(320/subjectLocalCoord)/Math.fround(320/expressionLocalCoord));
 return {handled:true,value:Math.fround(Math.fround(value)*ratio)};
}
