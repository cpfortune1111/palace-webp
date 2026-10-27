export function characterSoundIdentity(actor){
 if(actor.kind==='helper'){
  if(actor.instanceId===undefined)throw Error('Missing Helper sound identity');
  return 'character:'+actor.instanceId;
 }
 return 'character:'+(actor.player??actor.id??1);
}

export function resolveSoundChannelOwner(actor,{parent,root}){
 if(actor.kind!=='helper')return actor;
 if(actor.inheritChannels===1)return parent(actor)||actor;
 if(actor.inheritChannels===2)return root(actor.player)||actor;
 return actor;
}

export function createCharacterSoundChannels({capacity=32}={}){
 if(!Number.isInteger(capacity)||capacity<1||capacity>256)throw Error('Invalid character sound channel capacity');
 const records=new Set();
 function release(record){
  if(!records.delete(record))return false;
  record.onRelease();return true;
 }
 function stop(record){
  if(!records.has(record))return;
  record.sound.pause();release(record);
 }
 function owned(owner,channel=-1){return [...records].filter(record=>record.owner===owner&&(channel<0||record.channel===channel))}
 return {
  add(owner,channel,sound,onRelease=()=>{},options={}){
   if(channel<0||channel>=capacity)channel=-1;
   const pool=options.pool??owner;
   const priority=channel>=0?options.priority??0:0,existing=channel>=0?owned(owner,channel):[];
   if(existing.some(record=>options.lowPriority||(options.priority??0)<record.priority))return null;
   let slot=existing[0]?.slot;
   for(const record of existing)stop(record);
   const occupied=[...records].filter(record=>record.pool===pool);
   if(occupied.length>=capacity){
    if(options.lowPriority)return null;
    const eligible=occupied.filter(record=>(options.priority??0)>=record.priority).sort((first,second)=>first.timeStamp-second.timeStamp||first.slot-second.slot),victim=eligible.find(record=>record.channel<0)||eligible[0];
    if(!victim)return null;slot=victim.slot;stop(victim);
   }
   if(slot===undefined){slot=0;while(occupied.some(record=>record.slot===slot))slot++}
   const record={owner,channel,sound,onRelease,priority,pool,slot,timeStamp:(options.tick??0)|0,stopFlags:{...options.stopFlags}};records.add(record);
   sound.addEventListener('ended',()=>release(record),{once:true});sound.addEventListener('error',()=>release(record),{once:true});return record;
  },
  release,
  owned,
  entries:()=>[...records],
  has:record=>records.has(record),
  stopOwner(owner,channel){for(const record of owned(owner,channel))stop(record)},
  stopOnEvent(owner,event){if(!['hit','state'].includes(event))throw Error('Unsupported character sound event');for(const record of owned(owner))if(record.stopFlags[event])stop(record)},
  stopAll(){for(const record of [...records])stop(record)}
 };
}
