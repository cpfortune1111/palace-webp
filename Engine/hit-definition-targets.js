export function createHitDefinitionTargets(){
 let definitions=new WeakMap();
 function targets(params,ownerKey,create){
  let owners=definitions.get(params);
  if(!owners&&create){owners=new Map();definitions.set(params,owners)}
  if(!owners)return null;
  let recipients=owners.get(ownerKey);
  if(!recipients&&create){recipients=new Set();owners.set(ownerKey,recipients)}
  return recipients;
 }
 return {
  record:(params,ownerKey,recipientId)=>targets(params,ownerKey,true).add(recipientId),
  has:(params,ownerKey,recipientId)=>targets(params,ownerKey,false)?.has(recipientId)??false,
  clear:()=>{definitions=new WeakMap()}
 };
}
