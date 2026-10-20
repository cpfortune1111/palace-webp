export function selectTargetRedirect(owner,hitId=-1,index=0,api){
 if(index<0)return null;
 const selected=api.targets(owner).select(hitId,index,api.findActor);
 return selected.length?api.findActor(selected[0])??null:null;
}
