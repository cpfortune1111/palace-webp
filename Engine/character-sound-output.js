import {createLinearSoundPanner} from './linear-sound-panner.js';
import {createSoundPanState,setSoundPanState,updateSoundPanState} from './sound-pan-state.js';

export function createCharacterSoundOutput({createContext,view,sourcePosition,onError=error=>console.error(error)}){
 let context=null;
 const outputs=new Map();
 function resume(){if(context?.state==='suspended')return context.resume();return Promise.resolve()}
 function update(record){const output=outputs.get(record);if(!output)return null;return output.graph.set(updateSoundPanState(output.state,view(),sourcePosition),output.gain)}
 return {
  resume,
  setPan(record,params,gain){
   let output=outputs.get(record);
   if(!output){
    context??=createContext();const source=context.createMediaElementSource(record.sound),graph=createLinearSoundPanner(context,source);graph.output.connect(context.destination);
    output={graph,state:createSoundPanState(),gain:1};outputs.set(record,output);
   }
   if(gain!==undefined)output.gain=gain;setSoundPanState(output.state,params);const levels=update(record);resume().catch(onError);return levels;
  },
  update(){for(const record of outputs.keys())update(record)},
  release(record){const output=outputs.get(record);if(!output)return;outputs.delete(record);output.graph.disconnect()},
  size:()=>outputs.size,
  snapshot(record){const output=outputs.get(record);return output?{...output.state,gain:output.gain}:null}
 };
}
