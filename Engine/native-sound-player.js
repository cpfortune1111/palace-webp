export function createNativeSoundPlayer({loader,isActive,createNode=(context,options)=>new AudioWorkletNode(context,'palace-native-sound',{numberOfInputs:0,numberOfOutputs:1,outputChannelCount:[2],processorOptions:options}),moduleUrl=new URL('./sound-playback-worklet.js?v=02583',import.meta.url)}){
 const active=new Map(),modules=new WeakMap();
 function moduleFor(context){let pending=modules.get(context);if(!pending){pending=context.audioWorklet.addModule(moduleUrl);modules.set(context,pending);pending.catch(()=>{if(modules.get(context)===pending)modules.delete(context)})}return pending}
 return {
  prepare:moduleFor,
  play(record,{context,url,metadata,params,attach,onEnded,onError}){
   active.get(record)?.stop();const cancellation=new AbortController(),playback={...params},pending=new Map(),updates=[];let stopped=false,node=null,sequence=0;
   const handle={ready:null,settled:()=>Promise.all([...pending.values()].map(entry=>entry.promise)),modify(changes){if(stopped)return false;if(node){const id=++sequence;let resolve;const promise=new Promise(done=>{resolve=done});pending.set(id,{promise,resolve});node.port.postMessage({type:'modify',changes,id})}else updates.push({...changes});return true},stop(){if(stopped)return;stopped=true;cancellation.abort();for(const entry of pending.values())entry.resolve(false);pending.clear();if(node){node.port.postMessage({type:'stop'});node.disconnect();node.port.close()}if(active.get(record)===handle)active.delete(record)}};active.set(record,handle);
   handle.ready=(async()=>{
    const [buffer]=await Promise.all([loader.load(url,metadata,{signal:cancellation.signal}),moduleFor(context)]);
    if(stopped||!isActive(record)){handle.stop();return false}
    const channels=Array.from({length:buffer.numberOfChannels},(_,channel)=>buffer.getChannelData(channel).slice());node=createNode(context,{channels,metadata,params:playback,updates});
    node.port.onmessage=event=>{if(stopped)return;if(event.data.type==='modified'){const entry=pending.get(event.data.id);if(entry){pending.delete(event.data.id);entry.resolve(event.data.frames)}}else if(event.data.type==='ended'){const live=isActive(record);handle.stop();if(live)onEnded(record)}};
    node.onprocessorerror=()=>{if(!stopped){handle.stop();onError(Error('Native sound processor failed'))}};
    if(!isActive(record)||!attach(record,node)){handle.stop();return false}
    return true;
   })().catch(error=>{const report=!stopped&&isActive(record)&&error.name!=='AbortError';handle.stop();if(report)onError(error);return false});
   return handle;
  },
  stop(record){active.get(record)?.stop()},
  modify(record,changes){return active.get(record)?.modify(changes)??false},
  settled(record){return active.get(record)?.settled()??Promise.resolve([])},
  size:()=>active.size
 };
}
