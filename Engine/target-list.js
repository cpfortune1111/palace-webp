export function createTargetList(){
 const targets=[];
 function add(id){if(!targets.includes(id))targets.push(id)}
 function count(hitId=-1,lookup=()=>null){return targets.filter(id=>id>=0&&(hitId<0||lookup(id)?.getHit?.hitid===hitId)).length}
 function select(hitId=-1,index=-1,lookup=()=>null){
  if(hitId<0&&index<0)return [...targets];
  const filtered=[];
  for(const id of targets){const target=lookup(id);
   if(target&&(hitId<0||target.getHit?.hitid===hitId))filtered.push(id);
   if(index>=0&&filtered.length===index+1)return [filtered[index]];
  }
  return index<0?filtered:[];
 }
 function drop({excludeId=-1,excludeCharacter=-1,keepOne=true,lookup=()=>null,choose=()=>0,onDrop=()=>{}}={}){
  let retained;
  if(keepOne&&excludeCharacter>0)retained=targets.filter(id=>lookup(id)&&id===excludeCharacter);
  else {
   retained=excludeId<0?[...targets]:targets.filter(id=>lookup(id)?.getHit?.hitid===excludeId);
   if(keepOne||excludeId<0)retained=keepOne&&excludeId>=0&&retained.length?[retained[choose(retained.length)]]:[];
  }
  for(const id of targets)if(!retained.includes(id))onDrop(id,{selection:!(keepOne&&excludeCharacter>0)&&(excludeId<0||lookup(id)?.getHit?.hitid===excludeId)});
  targets.splice(0,targets.length,...retained);
 }
 function prune({lookup,stateChanging=()=>false,reversal=false,onRemove=()=>{}}={}){
  if(reversal)return;
  let index=0;
  while(index<targets.length){const id=targets[index],target=lookup(id);
   if(target&&target.moveType!=='H'&&!stateChanging(target)){
    targets[index]=targets[targets.length-1];targets.pop();onRemove(id,target);
   }else index++;
  }
 }
 return {add,count,select,drop,prune,has:id=>targets.includes(id),ids:()=>[...targets],clear:()=>targets.splice(0)};
}

export function applyTargetFacingController(controller,owner,api){
 if(String(controller.type).toLowerCase()!=='targetfacing')return false;
 const params=controller.params||{},integer=value=>Math.trunc(Number(api.evaluate(value)))|0;
 if(params.redirectid!==undefined)owner=api.findActor(integer(params.redirectid));
 if(!owner)return true;
 const hitId=params.id===undefined?-1:integer(params.id),index=params.index===undefined?-1:integer(params.index),value=integer(params.value??0);
 if(value===0)return true;
 const facing=value<0?-owner.facing:owner.facing;
 for(const id of api.targets(owner).select(hitId,index,api.findActor)){const target=api.findActor(id);if(target)api.setFacing(target,facing)}
 return true;
}

export function applyTargetDropController(controller,owner,api){
 if(String(controller.type).toLowerCase()!=='targetdrop')return false;
 const params=controller.params||{},integer=value=>Math.trunc(Number(api.evaluate(value)))|0;
 if(params.redirectid!==undefined)owner=api.findActor(integer(params.redirectid));
 if(!owner)return true;
 api.targets(owner).drop({excludeId:params.excludeid===undefined?-1:integer(params.excludeid),keepOne:params.keepone===undefined?true:Number(api.evaluate(params.keepone))!==0,lookup:api.findActor,choose:api.choose,onDrop:(id,reason)=>api.onDrop(owner,id,reason)});
 return true;
}