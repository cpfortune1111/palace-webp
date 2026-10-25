// Ikemen flattenClsnProxies: breadth-first, following proxy children only.
export function clsnProxyFamily(actor,helpers,{group=1}={}){
 if(group===3)return [actor];
 const family=[actor],seen=new Set([actor.key??'root'+actor.player]);
 for(let index=0;index<family.length;index++){
  const parent=family[index],parentKey=parent.key??'root'+parent.player;
  for(const helper of helpers){
   if(helper.kind!=='helper'||helper.destroyed||!helper.clsnProxy||seen.has(helper.key))continue;
   const key=helper.parentKey??'root'+helper.player;
   if(key!==parentKey)continue;
   seen.add(helper.key);family.push(helper);
  }
 }
 return family;
}
