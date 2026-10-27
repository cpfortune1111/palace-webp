const float=Math.fround;
export function activateExplodBinding(effect,ownerId){
 if(effect.nativeBinding)return;
 const relative=[float((effect.bindOffset?.[0]??0)*effect.facing),float(effect.bindOffset?.[1]??0),float(effect.bindOffset?.[2]??0)],position=['x','y','z'].map((name,axis)=>float(Number(effect[name]??0)-relative[axis]));
 effect.nativeBinding={targetId:ownerId,relative,position,old:[...position],next:[...position],firstUpdate:effect.age===0};
 if(!effect.nativeMotion){effect.accel=[float((effect.accel?.[0]??0)*effect.facing),float(effect.accel?.[1]??0),float(effect.accel?.[2]??0)];effect.nativeMotion=true}
 effect.nativeHitPause=true;effect.nativePauseTime=true;effect.depth=true;
}
export function resetExplodBindingPosition(effect,position){
 const state=effect.nativeBinding;state.position=position.map(float);state.old=[...state.position];state.next=[...state.position];
}
export function resetLegacyExplodBinding(effect){
 resetExplodBindingPosition(effect,[0,0,0]);effect.nativeBinding.relative=[0,0,0];effect.nativeBinding.targetId=-2;
}
export function modifyExplodBindingPosition(effect,{position,spread},unit){
 const state=effect.nativeBinding;
 for(let axis=0;axis<3;axis++)state.relative[axis]=float((position?.[axis]===undefined?state.relative[axis]:float(position[axis]*unit))+float(spread[axis]*unit));
}
export function applyExplodBindingParameters(effect,ownerId,values,ikemen){
 const state=effect.nativeBinding;
 if(values.bindid!==undefined)state.targetId=values.bindid===-1?ownerId:values.bindid;
 if(values.bindtime!==undefined){effect.bindtime=ikemen&&values.bindtime>0?((effect.age|0)+values.bindtime)|0:values.bindtime;resetExplodBindingPosition(effect,state.position)}
}
export function finalizeExplodBindingPosition(effect,{id,position,facing}){
 const state=effect.nativeBinding,previousFacing=effect.facing;
 state.targetId=id;state.relative[0]=float(state.relative[0]*facing);effect.facing=facing;effect.screen=false;effect.screenRight=false;
 effect.vx=float(Number(effect.vx??0)*facing/previousFacing);effect.accel??=[0,0,0];effect.accel[0]=float(effect.accel[0]*facing/previousFacing);
 resetExplodBindingPosition(effect,position);
}
export function stepExplodBinding(effect,targetPosition){
 const state=effect.nativeBinding;
 if(effect.bindtime!==0&&!effect.screen){if(targetPosition)state.position=targetPosition.map(float)}else state.position=[...state.next];
 for(const [axis,name] of ['x','y','z'].entries())effect[name]=float(state.position[axis]+state.relative[axis]);
 if(effect.bindtime>0)effect.bindtime--;
 state.old=[...state.position];state.next=state.position.map((value,axis)=>float(value+Number(effect[['vx','vy','vz'][axis]]??0)));
 for(const [axis,name] of ['vx','vy','vz'].entries()){
  const friction=float(effect.friction?.[axis]??1);effect[name]=float(float(Number(effect[name]??0)*friction)+Number(effect.accel?.[axis]??0));
  if(Math.abs(effect[name])<float(.1)&&Math.abs(friction)<1)effect[name]=0;
 }
}
