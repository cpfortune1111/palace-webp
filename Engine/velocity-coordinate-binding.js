export function velocityCoordinateBinding(binding,worldScale){
 if(!binding)return null;
 if(!(worldScale>0&&Number.isFinite(worldScale)))throw Error('Invalid velocity coordinate scale');
 const result=Object.create(binding);
 Object.defineProperties(result,{
  localScale:{value:Math.fround(worldScale)},
  vx:{get:()=>Math.fround((binding.vx??0)/worldScale),set:value=>{binding.vx=Math.fround(value*worldScale)}},
  vy:{get:()=>Math.fround((binding.vy??0)/worldScale),set:value=>{binding.vy=Math.fround(value*worldScale)}},
  getHit:{get:()=>({...binding.getHit,xvel:Math.fround((binding.getHit?.xvel??0)/worldScale),yvel:Math.fround((binding.getHit?.yvel??0)/worldScale)})}
 });
 return result;
}
