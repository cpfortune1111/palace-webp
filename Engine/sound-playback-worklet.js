import {createNativeSoundStream} from './native-sound-stream.js';

class PalaceSoundPlayback extends AudioWorkletProcessor{
 constructor(options){
  super();const {channels,metadata,params}=options.processorOptions;
  const buffer={sampleRate:metadata.sourceSampleRate,length:channels[0].length,numberOfChannels:channels.length,getChannelData:channel=>channels[channel]};
  this.stream=createNativeSoundStream(buffer,metadata,params,sampleRate);this.stopped=false;this.frames=0;
  this.port.onmessage=event=>{if(event.data.type==='stop')this.stopped=true};
 }
 process(inputs,outputs){
  if(this.stopped)return false;
  const output=outputs[0],result=this.stream.read(output[0].length);
  for(let frame=0;frame<result.samples.length;frame++)for(let channel=0;channel<2;channel++)output[channel][frame]=result.samples[frame][channel];
  this.frames+=result.samples.length;
  if(result.samples.length<output[0].length||!result.ok){this.stopped=true;this.port.postMessage({type:'ended',frames:this.frames});return false}
  return true;
 }
}

registerProcessor('palace-native-sound',PalaceSoundPlayback);
