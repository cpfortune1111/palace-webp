export function createDecodedSoundFrames(buffer,metadata){
 if(!metadata||!Number.isInteger(metadata.sourceSampleRate)||!Number.isInteger(metadata.sourceFrames))throw Error('Missing native sound sample metadata');
 if(buffer.sampleRate!==metadata.sourceSampleRate)throw Error('Decoded sound sample rate mismatch');
 if(buffer.length!==metadata.sourceFrames)throw Error('Decoded sound frame count mismatch');
 if(![1,2].includes(buffer.numberOfChannels)||buffer.numberOfChannels!==metadata.sourceChannels)throw Error('Unsupported decoded sound channels');
 const left=buffer.getChannelData(0),right=buffer.getChannelData(buffer.numberOfChannels===1?0:1);let position=0;
 return {
  length:buffer.length,
  get position(){return position},
  read(count){
   if(!Number.isInteger(count)||count<0)throw Error('Invalid decoded sound read size');
   const samples=[],end=Math.min(position+count,buffer.length);while(position<end){samples.push([left[position],right[position]]);position++}
   return {samples,ok:samples.length>0};
  },
  seek(next){if(!Number.isInteger(next)||next<0||next>buffer.length)return Error('Decoded sound seek out of range');position=next;return null},
  error:()=>null
 };
}
