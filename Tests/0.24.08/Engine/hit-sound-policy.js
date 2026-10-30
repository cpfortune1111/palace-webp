// Channel zero defaults to stopongethit in the pinned native engine.
// Keep ownership separate from the legacy playback channel numbering.
export function createHitSoundPolicy(){
 const active=new Map();
 return {
  track(sound,owner,channel,explicit){
   active.set(sound,{owner,stop:explicit===undefined?channel===0:!!explicit});
   const release=()=>active.delete(sound);
   sound.addEventListener('ended',release,{once:true});
   sound.addEventListener('error',release,{once:true});
  },
  hit(owner,guarded=false){
   if(guarded)return;
   for(const [sound,entry] of [...active])if(entry.owner===owner&&entry.stop){active.delete(sound);sound.pause()}
  }
 };
}
