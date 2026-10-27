const f=Math.fround;
// WEB positions/controller offsets are in world units; size.draw.offset is local.
export function characterCollisionPosition(actor,{drawOffset=[0,0],offset=[0,0],worldScale=1,offsetScale=1}={}){
 const ratio=f(worldScale);
 return ['x','y'].map((axis,index)=>{
  const drawing=f(f(Number(drawOffset[index]??0))*(index===0?(actor.facing??1):1)),controller=f(f(Number(offset[index]??0)/offsetScale)/ratio),shift=f(f(drawing+controller)*ratio);
  return f(Number(actor[axis]??0)+shift);
 });
}
