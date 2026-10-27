export function positionCoordinateBinding(binding,worldScale){
 if(!binding)return null;
 if(!(worldScale>0&&Number.isFinite(worldScale)))throw Error('Invalid position coordinate scale');
 const result=Object.create(binding),properties={localScale:{value:Math.fround(worldScale)}};
 for(const axis of ['x','y','z'])properties[axis]={get:()=>Math.fround((binding[axis]??0)/worldScale),set:value=>{binding[axis]=Math.fround(value*worldScale)}};
 for(const name of ['groundLevel','platformY'])properties[name]={get:()=>Math.fround((binding[name]??0)/worldScale)};
 Object.defineProperties(result,properties);
 return result;
}
