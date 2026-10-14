export function createHitDefinitionTargets(){
 let definitions=new WeakMap();
 const pendingGroups=new Set();
 function targets(params,ownerKey,create){
  let owners=definitions.get(params);
  if(!owners&&create){owners=new Map();definitions.set(params,owners)}
  if(!owners)return null;
  let recipients=owners.get(ownerKey);
  if(!recipients&&create){recipients={ownerKey,committed:[],pending:[]};owners.set(ownerKey,recipients)}
  return recipients;
 }
 return {
  record(params,ownerKey,recipientId,tick=0){const group=targets(params,ownerKey,true);group.pending.push({recipientId,tick});pendingGroups.add(group)},
  has:(params,ownerKey,recipientId)=>targets(params,ownerKey,false)?.committed.includes(recipientId)??false,
  queued:(params,ownerKey,recipientId)=>targets(params,ownerKey,false)?.pending.some(entry=>entry.recipientId===recipientId)??false,
  count:(params,ownerKey)=>targets(params,ownerKey,false)?.committed.length??0,
  commitActor(ownerKey,tick){for(const group of pendingGroups){if(group.ownerKey!==ownerKey)continue;const ready=group.pending.filter(entry=>entry.tick<tick);group.pending=group.pending.filter(entry=>entry.tick>=tick);group.committed.push(...ready.map(entry=>entry.recipientId));if(!group.pending.length)pendingGroups.delete(group)}},
  clear:()=>{definitions=new WeakMap();pendingGroups.clear()}
 };
}
