export function createNativeSoundPlayer({loader,isActive,createNode=(context,options)=>new AudioWorkletNode(context,'palace-native-sound',{numberOfInputs:0,numberOfOutputs:1,outputChannelCount:[2],processorOptions:options}),moduleUrl=new URL('./sound-playback-worklet.js',import.meta.url)}){
 const active=new Map(),modules=new WeakMap();
 function moduleFor(context){let pending=modules.get(context);if(!pending){pending=context.audioWorklet.addModule(moduleUrl);modules.set(context,pending);pending.catch(()=>{if(modules.get(context)===pending)modules.delete(context)})}return pending}
 return {
  play(record,{context,url,metadata,params,attach,onEnded,onError}){
   active.get(record)?.stop();const cancellation=new AbortController();let stopped=false,node=null;
   const handle={ready:null,stop(){if(stopped)return;stopped=true;cancellation.abort();if(node){node.port.postMessage({type:'stop'});node.disconnect();node.port.close()}if(active.get(record)===handle)active.delete(record)}};active.set(record,handle);
   handle.ready=(async()=>{
    const [buffer]=await Promise.all([loader.load(url,metadata,{signal:cancellation.signal}),moduleFor(context)]);
    if(stopped||!isActive(record)){handle.stop();return false}
    const channels=Array.from({length:buffer.numberOfChannels},(_,channel)=>buffer.getChannelData(channel).slice());node=createNode(context,{channels,metadata,params});
    node.port.onmessage=event=>{if(!stopped&&event.data.type==='ended'){const live=isActive(record);handle.stop();if(live)onEnded(record)}};
    node.onprocessorerror=()=>{if(!stopped){handle.stop();onError(Error('Native sound processor failed'))}};
    if(!isActive(record)||!attach(record,node)){handle.stop();return false}
    return true;
   })().catch(error=>{const report=!stopped&&isActive(record)&&error.name!=='AbortError';handle.stop();if(report)onError(error);return false});
   return handle;
  },
  stop(record){active.get(record)?.stop()},
  size:()=>active.size
 };
}
