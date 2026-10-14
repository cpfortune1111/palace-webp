export function recordTargetedBy(previous,sourceId,defaultJuggle){
 const entries=(previous??[]).map(entry=>entry.slice()),index=entries.findIndex(entry=>entry[0]===sourceId),juggle=index<0?defaultJuggle:entries[index][1];
 if(index>=0)entries.splice(index,1);
 entries.push([sourceId,juggle]);
 return entries;
}
