export function projectileCollisionSettings(params,{evaluate,split,defaultScale=[1,1]}){
 let scale=defaultScale.map(Math.fround);
 if(params.projclsnscale!==undefined){const pair=split(params.projclsnscale);scale=[Math.fround(Number(evaluate(pair[0]))),pair[1]===undefined?1:Math.fround(Number(evaluate(pair[1])))]}
 const angle=params.projclsnangle===undefined?0:Math.fround(Number(evaluate(params.projclsnangle)));
 return {scale,angle};
}

export function projectileCollisionBoxes(sets,group,settings,{worldScale=1,zScale=1}={}){
 if(group!==1&&group!==2)return [];
 const scale=settings.scale.map(value=>Math.fround(Math.fround(value*worldScale)*zScale));
 return (sets[group===1?'c1':'c2']||[]).map(rect=>{const result=rect.map((value,index)=>Math.fround(value*scale[index%2]));return {rect:[Math.min(result[0],result[2]),Math.min(result[1],result[3]),Math.max(result[0],result[2]),Math.max(result[1],result[3])],angle:settings.angle,pivot:[0,0]}});
}
