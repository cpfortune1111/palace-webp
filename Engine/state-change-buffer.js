export function createStateChangeBuffer(){
 const entries=new Map();
 return {
  request(key,selection,select){
   const previous=entries.get(key),entry={...selection};entries.set(key,entry);
   try{select(entry)}catch(error){if(previous)entries.set(key,previous);else entries.delete(key);throw error}
   return entry;
  },
  initialize(key,{paused,hitPause,tick,initialize}){
   if(typeof paused!=='boolean'||typeof hitPause!=='boolean'||!Number.isFinite(tick))throw Error('Missing actual state initialization phase');
   const entry=entries.get(key);if(!entry||paused||hitPause||entry.selectedTick>=tick)return false;
   initialize(entry);if(entries.get(key)===entry)entries.delete(key);return true;
  },
  get:key=>entries.get(key),
  has:key=>entries.has(key),
  cancel:key=>entries.delete(key),
  clear:()=>entries.clear(),
  snapshot:()=>[...entries].map(([key,entry])=>[key,{...entry}]),
  restore(snapshot){entries.clear();for(const [key,entry]of snapshot)entries.set(key,{...entry})}
 };
}
