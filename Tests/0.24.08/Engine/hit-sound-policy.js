// Channel zero defaults to stopongethit in the pinned native engine.
// Keep ownership separate from the legacy playback channel numbering.
export function createHitSoundPolicy(){
 const active=new Map();
 return {
  track(sound,owner,channel,explicit){
   active.set(sound,{owner,channel,stop:channel===0});
   const release=()=>active.delete(sound);
   sound.addEventListener('ended',release,{once:true});
   sound.addEventListener('error',release,{once:true});
  },
  stopChannel(owner,channel){
   for(const [sound,entry] of [...active])if(entry.owner===owner&&entry.channel===channel){active.delete(sound);sound.pause()}
  },
  hit(owner,guarded=false){
   if(guarded)return;
   for(const [sound,entry] of [...active])if(entry.owner===owner&&entry.stop){active.delete(sound);sound.pause()}
  }
 };
}
