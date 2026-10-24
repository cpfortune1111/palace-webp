export function stepModifiedExplodMotion(effect){
 for(const [axis,name] of ['x','y','z'].entries()){
  const velocity=['vx','vy','vz'][axis],friction=Math.fround(effect.friction?.[axis]??1);
  effect[name]=Math.fround(Number(effect[name]??0)+Number(effect[velocity]??0));
  effect[velocity]=Math.fround(Math.fround(Number(effect[velocity]??0)*friction)+Number(effect.accel?.[axis]??0));
  if(Math.abs(effect[velocity])<Math.fround(.1)&&Math.abs(friction)<1)effect[velocity]=0;
 }
}
