import {createLinearSoundPanner} from './linear-sound-panner.js';
import {createSoundPanState,setSoundPanState,updateSoundPanState} from './sound-pan-state.js';

export function createCharacterSoundOutput({createContext,view,sourcePosition,onError=error=>console.error(error)}){
 let context=null;
 const outputs=new Map();
 function resume(){if(context?.state==='suspended'&&typeof context.startRendering!=='function')return context.resume();return Promise.resolve()}
 function update(record){const output=outputs.get(record);if(!output)return null;if(output.native)output.source.gain.setValueAtTime(record.sound.muted?0:record.sound.volume??1,context.currentTime);return output.graph.set(updateSoundPanState(output.state,view(),sourcePosition),output.gain)}
 return {
  prepare(){context??=createContext();return context},
  resume,
  setGain(record,gain){const output=outputs.get(record);if(!output)return null;output.gain=gain;return update(record)},
  setPan(record,params,gain){
   let output=outputs.get(record);
   if(!output){
    context??=createContext();const native=!!record.nativePlayback,source=native?context.createGain():context.createMediaElementSource(record.sound),graph=createLinearSoundPanner(context,source);graph.output.connect(context.destination);
    output={graph,source,native,attached:null,state:createSoundPanState(),gain:1};outputs.set(record,output);
   }
   if(gain!==undefined)output.gain=gain;setSoundPanState(output.state,params);const levels=update(record);resume().catch(onError);return levels;
  },
  update(){for(const record of outputs.keys())update(record)},
  contextFor(record){if(!outputs.has(record))throw Error('Missing character sound output');return context},
  attach(record,node){const output=outputs.get(record);if(!output)return false;if(!output.native||output.attached)throw Error('Invalid native sound attachment');node.connect(output.source);output.attached=node;return true},
  release(record){const output=outputs.get(record);if(!output)return;outputs.delete(record);output.attached?.disconnect();output.graph.disconnect()},
  size:()=>outputs.size,
  snapshot(record){const output=outputs.get(record);return output?{...output.state,gain:output.gain,native:output.native,attached:!!output.attached}:null}
 };
}
