export function linearSoundGains(pan,gain=1){
 const position=Math.max(-1,Math.min(1,Math.fround(pan))),level=Math.max(0,Math.min(2,Math.fround(gain)));
 return [Math.min(Math.fround(level*Math.fround(1-position)),2),Math.min(Math.fround(level*Math.fround(1+position)),2)];
}

export function createLinearSoundPanner(context,source){
 const input=context.createGain(),splitter=context.createChannelSplitter(2),left=context.createGain(),right=context.createGain(),output=context.createChannelMerger(2);
 input.channelCount=2;input.channelCountMode='explicit';input.channelInterpretation='speakers';
 source.connect(input);input.connect(splitter);splitter.connect(left,0);splitter.connect(right,1);left.connect(output,0,0);right.connect(output,0,1);
 return {
  output,
  set(pan,gain=1){const levels=linearSoundGains(pan,gain);left.gain.setValueAtTime(levels[0],context.currentTime);right.gain.setValueAtTime(levels[1],context.currentTime);return levels},
  disconnect(){source.disconnect(input);input.disconnect();splitter.disconnect();left.disconnect();right.disconnect();output.disconnect()}
 };
}
