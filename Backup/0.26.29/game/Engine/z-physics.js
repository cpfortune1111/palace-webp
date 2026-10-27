export function stepZPhysics(position,velocity,{physics='N',frozen=false,bound=false,standFriction=0.85,crouchFriction=0.82,standThreshold=4}={}){
 const nextPosition=frozen||bound?position:Math.fround(position+velocity);
 let nextVelocity=velocity;
 if(physics==='S'){nextVelocity=Math.fround(velocity*Math.fround(standFriction));if(Math.abs(nextVelocity)<standThreshold)nextVelocity=0}
 else if(physics==='C')nextVelocity=Math.fround(velocity*Math.fround(crouchFriction));
 return {position:nextPosition,velocity:nextVelocity};
}
