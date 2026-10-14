const float=Math.fround;
const clamp=(value,minimum,maximum)=>value<minimum?minimum:value>maximum?maximum:value;

export function createDepthCameraState(){return {front:0,back:0,offset:0}}

export function updateDepthCamera(state,actors,config,bounds,{localScale=1,gameWidth=1280,skipSmoothing=false}={}){
 const tracked=actors.filter(actor=>actor.moveCamera&&Number.isFinite(actor.z)).map(actor=>float(actor.z));
 if(tracked.length){state.front=Math.min(...tracked);state.back=Math.max(...tracked)}
 const tension=Math.max(0,float(Number(config.ztension??0)*localScale)),top=float(bounds[0]+tension),bottom=float(bounds[1]-tension),front=float(state.front*localScale),back=float(state.back*localScale),lower=float(back-bottom),upper=float(front-top),screen=float(Number(config.depthtoscreen??1));
 let base=screen===0?0:float(state.offset/screen);
 if(Number(config.zautocenter??0)!==0)base=float(float(front+back)/2);
 let target=lower<=upper?clamp(base,lower,upper):float(float(lower+upper)/2);
 target=Math.max(target,float(Number(config.zboundtop??0)*localScale));target=Math.min(target,float(Number(config.zboundbot??0)*localScale));target=float(target*screen);
 if(skipSmoothing)state.offset=target;
 else {const threshold=float(gameWidth/3200),blend=clamp(float(0.05*Number(config.ztensionvel??1)),0,1);for(let pass=0;pass<3;pass++){state.offset=float(state.offset+float(float(target-state.offset)*blend));if(Math.abs(float(target-state.offset))<threshold){state.offset=target;break}}}
 return state.offset;
}
