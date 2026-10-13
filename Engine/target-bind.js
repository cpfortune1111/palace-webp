export function targetBindingMatchesHit(binding,hit){
 return !!binding&&!!hit&&(binding.ownerId!==undefined&&hit.attackerId===binding.ownerId||binding.binderKey!==undefined&&hit.snapBinderKey===binding.binderKey);
}

export function assignTargetBinding(target,owner,settings){
 if(owner.targetBinding?.owner===target)owner.targetBinding=null;
 target.targetBinding=settings.time===0?null:{owner,remaining:settings.time,position:[...settings.position]};
}

export function updateTargetBinding(target,{localScale=actor=>actor.localScale??1,exists=()=>true,copyVelocity=true}={}){
 const binding=target.targetBinding;
 if(!binding)return false;
 const owner=binding.owner;
 if(binding.remaining===0||!exists(owner)){target.targetBinding=null;return false}
 const scale=localScale(owner)/localScale(target),axes=['x','y','z'],velocities=['vx','vy','vz'];
 for(let index=0;index<3;index++){
  const offset=binding.position[index];
  if(Number.isNaN(offset))continue;
  if(index===2&&target.z===undefined){if(offset!==0)throw Error('TargetBind requires a depth-enabled actor');continue}
  target[axes[index]]=owner[axes[index]]*scale+offset*(index===0?owner.facing:1);
  if(copyVelocity)target[velocities[index]]=owner[velocities[index]];
  if(target.getHit)target.getHit[axes[index]+'off']=0;
 }
 return true;
}

export function stepTargetBinding(target,{binderPaused=false,binderWasHit=false,onRelease=()=>{}}={}){
 const binding=target.targetBinding;
 if(!binding||binding.remaining<=0)return;
 if(binderWasHit){target.targetBinding=null;onRelease(target);return}
 if(!binderPaused)binding.remaining--;
}

export function applyTargetBindController(controller,caller,api){
 if(String(controller.type).toLowerCase()!=='targetbind')return false;
 const params=controller.params||{},integer=value=>Math.trunc(Number(api.evaluate(value)))|0;
 const owner=params.redirectid===undefined?caller:api.findActor(integer(params.redirectid));
 if(!owner)return true;
 const hitId=params.id===undefined?-1:integer(params.id),index=params.index===undefined?-1:integer(params.index),time=params.time===undefined?1:integer(params.time);
 const scale=Math.fround(api.localScale(caller)/api.localScale(owner)),values=params.pos===undefined?[]:api.split(params.pos);
 let position=[0,0,0].map((fallback,index)=>values[index]===undefined?fallback:Math.fround(Math.fround(Number(api.evaluate(values[index])))*scale));
 for(const id of api.targets(owner).select(hitId,index,api.findActor)){
  const target=api.findActor(id);
  if(!target)continue;
  const targetScale=Math.fround(api.localScale(owner)/api.localScale(target));
  position=position.map(value=>Math.fround(value*targetScale));
  api.bind(target,owner,{time,facing:0,position:[...position],targetBind:true});
 }
 return true;
}

