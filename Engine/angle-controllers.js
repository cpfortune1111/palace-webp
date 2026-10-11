export function createAngleState(){return {value:0,xangle:0,yangle:0,enabled:false,scale:[1,1],pivot:[0,0]}}

export function resetAngleDraw(state){state.enabled=false;state.scale=[1,1];state.pivot=[0,0]}

export function applyAngleController(controller,actor,api){
 const type=controller.type.toLowerCase();
 if(!['angleset','angleadd','anglemul','angledraw'].includes(type))return false;
 const params=controller.params||controller;
 const target=params.redirectid===undefined?actor:api.findActor(Math.trunc(Number(api.evaluate(params.redirectid))));
 if(!target)return true;
 const state=target.angleState;
 if(!state)throw Error('Missing actor angle storage');
 for(const axis of ['value','xangle','yangle']){
  if(params[axis]===undefined&&(type==='angleadd'||type==='angledraw'))continue;
  const value=Math.fround(Number(api.evaluate(params[axis]??0)));
  state[axis]=type==='angleadd'?Math.fround(state[axis]+value):type==='anglemul'?Math.fround(state[axis]*value):value;
 }
 if(type==='angledraw'){
  for(const name of ['scale','pivot'])if(params[name]!==undefined){
   const pair=api.split(params[name]);
   for(let axis=0;axis<Math.min(2,pair.length);axis++){
    const value=Math.fround(Number(api.evaluate(pair[axis])));
    state[name][axis]=name==='scale'?Math.fround(state[name][axis]*value):value;
   }
  }
  state.enabled=true;
 }
 return true;
}

export function transformAngleDrawing(context,state){
 if(!state?.enabled)return;
 if(state.xangle!==0||state.yangle!==0)throw Error('AngleDraw 3D projection is not implemented');
 const [pivotX,pivotY]=state.pivot;
 context.translate(pivotX,pivotY);
 context.rotate(-state.value*Math.PI/180);
 context.scale(state.scale[0],state.scale[1]);
 context.translate(-pivotX,-pivotY);
}
