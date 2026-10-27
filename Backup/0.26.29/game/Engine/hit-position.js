export function prepareHitPosition(params,{splitPair,evaluate}){
 const vector=key=>params[key]===undefined?[]:splitPair(params[key]).map(value=>String(value).trim()===''?undefined:Math.fround(Number(evaluate(value))));
 const snap=vector('snap'),argumentsList=params.snap===undefined?[]:splitPair(params.snap);
 const snapTime=argumentsList[3]===undefined||String(argumentsList[3]).trim()===''?0:Math.trunc(Number(evaluate(argumentsList[3])))|0;
 return {minDistance:vector('mindist'),maxDistance:vector('maxdist'),snap:snap.slice(0,3),snapTime};
}

export function consumeHitPositionOffsets(fighter){
 const hit=fighter.getHit;
 if(!hit||fighter.moveType!=='H')return false;
 if(hit.zoff&&fighter.z===undefined)throw Error('HitDef depth offset requires a depth-enabled actor');
 fighter.x+=Number(hit.xoff??0);fighter.y+=Number(hit.yoff??0);
 if(fighter.z!==undefined)fighter.z+=Number(hit.zoff??0);
 hit.xoff=0;hit.yoff=0;hit.zoff=0;
 return true;
}

export function hitPositionPlan({origin,target,facing,minDistance=[],maxDistance=[],snap=[],snapTime=0,guarded=false,aerial=false,scaleRatio=1,binderPaused=false}){
 const positions=Array(3).fill(null);
 for(let axis=0;axis<3;axis++){
  if(axis===1&&guarded&&!aerial)continue;
  const minimum=snap[axis]??minDistance[axis],maximum=snap[axis]??maxDistance[axis];
  const direction=axis===0?facing:1;
  if(minimum!==undefined&&Number.isFinite(minimum)){
   const bound=origin[axis]+direction*minimum;
   const coordinate=axis===0?target[axis]:target[axis]/scaleRatio;
   if(direction*coordinate<direction*bound)positions[axis]=bound;
  }
  if(maximum!==undefined&&Number.isFinite(maximum)){
   const bound=origin[axis]+direction*maximum;
   if(direction*target[axis]/scaleRatio>direction*bound)positions[axis]=bound;
  }
 }
 const offsets=positions.map((position,axis)=>position===null?0:position*scaleRatio-target[axis]);
 const binding=snapTime===0?null:{remaining:snapTime+(snapTime>0&&!binderPaused?1:0),offsets:positions.map((position,axis)=>position===null?null:(snap[axis]??minDistance[axis])*scaleRatio)};
 return {offsets,binding};
}

export function hitPositionOffsets(options){
 return hitPositionPlan(options).offsets;
}

export function snapBindingNeedsSelfState(binding,binder,{binderWasHit=false}={}){
 return !!binding&&binding.remaining>0&&(!binder||binderWasHit);
}

export function updateSnapBinding(fighter,binder,{binderPaused=false,copyVelocity=false}={}){
 const binding=fighter.snapBinding;
 if(!binding)return false;
 if(!binder||binding.remaining===0){fighter.snapBinding=null;return false}
 const axes=['x','y','z'],velocities=['vx','vy','vz'];
 if(binding.offsets[2]!==null&&fighter.z===undefined)throw Error('Snap binding requires a depth-enabled actor');
 axes.forEach((axis,index)=>{
  if(binding.offsets[index]===null)return;
  fighter[axis]=binder[axis]+binding.offsets[index]*(index===0?binder.facing:1);
  if(copyVelocity)fighter[velocities[index]]=binder[velocities[index]];
  if(fighter.getHit)fighter.getHit[axis+'off']=0;
 });
 if(binding.remaining>0&&!binderPaused)binding.remaining--;
 return true;
}
