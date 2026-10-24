export function animationFirstLoopDuration(frames){
 let duration=0;
 for(const frame of frames){
  if(frame.time<0)return Infinity;
  duration+=Math.max(0,Number(frame.time));
 }
 return duration;
}
