export function createTargetList(){
 const targets=[];
 function add(id){if(!targets.includes(id))targets.push(id)}
 function count(hitId=-1,lookup=()=>null){return targets.filter(id=>id>=0&&(hitId<0||lookup(id)?.getHit?.hitid===hitId)).length}
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
 return {add,count,drop,prune,has:id=>targets.includes(id),ids:()=>[...targets],clear:()=>targets.splice(0)};
}

export function applyTargetDropController(controller,owner,api){
 if(String(controller.type).toLowerCase()!=='targetdrop')return false;
 const params=controller.params||{},integer=value=>Math.trunc(Number(api.evaluate(value)))|0;
 if(params.redirectid!==undefined)owner=api.findActor(integer(params.redirectid));
 if(!owner)return true;
 api.targets(owner).drop({excludeId:params.excludeid===undefined?-1:integer(params.excludeid),keepOne:params.keepone===undefined?true:Number(api.evaluate(params.keepone))!==0,lookup:api.findActor,choose:api.choose,onDrop:(id,reason)=>api.onDrop(owner,id,reason)});
 return true;
}
