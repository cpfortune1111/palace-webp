export function velocityCoordinateBinding(binding,worldScale){
 if(!binding)return null;
 if(!(worldScale>0&&Number.isFinite(worldScale)))throw Error('Invalid velocity coordinate scale');
 const result=Object.create(binding);
 const properties={localScale:{value:Math.fround(worldScale)},getHit:{get:()=>({...binding.getHit,...Object.fromEntries(['x','y','z'].map(axis=>[axis+'vel',Math.fround((binding.getHit?.[axis+'vel']??0)/worldScale)]))})}};
 for(const axis of ['x','y','z'])properties['v'+axis]={get:()=>Math.fround((binding['v'+axis]??0)/worldScale),set:value=>{binding['v'+axis]=Math.fround(value*worldScale)}};
 Object.defineProperties(result,properties);
 return result;
}
