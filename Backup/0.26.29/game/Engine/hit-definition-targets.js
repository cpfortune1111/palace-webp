import {clearActorRegistry} from './actor-registry-cleanup.js';
export function createHitDefinitionTargets(){
 const owners=new Map();
 const pendingGroups=new Set();
 function targets(params,ownerKey,create){
  let definitions=owners.get(ownerKey);
  if(!definitions&&create){definitions=new WeakMap();owners.set(ownerKey,definitions)}
  if(!definitions)return null;
  let recipients=definitions.get(params);
  if(!recipients&&create){recipients={ownerKey,committed:[],pending:[]};definitions.set(params,recipients)}
  return recipients;
 }
 return {
  record(params,ownerKey,recipientId,tick=0){const group=targets(params,ownerKey,true);group.pending.push({recipientId,tick});pendingGroups.add(group)},
  has:(params,ownerKey,recipientId)=>targets(params,ownerKey,false)?.committed.includes(recipientId)??false,
  queued:(params,ownerKey,recipientId)=>targets(params,ownerKey,false)?.pending.some(entry=>entry.recipientId===recipientId)??false,
  count:(params,ownerKey)=>targets(params,ownerKey,false)?.committed.length??0,
  commitActor(ownerKey,tick){for(const group of pendingGroups){if(group.ownerKey!==ownerKey)continue;const ready=group.pending.filter(entry=>entry.tick<tick);group.pending=group.pending.filter(entry=>entry.tick>=tick);group.committed.push(...ready.map(entry=>entry.recipientId));if(!group.pending.length)pendingGroups.delete(group)}},
  clear(keepKeys){clearActorRegistry(owners,keepKeys);for(const group of pendingGroups)if(!keepKeys?.has(group.ownerKey))pendingGroups.delete(group)}
 };
}
