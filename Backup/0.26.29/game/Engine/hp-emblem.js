export function hpEmblemLayers(life,lifeMax=1000){
 return life<=0?[952]:life<=lifeMax/4?[950,951]:[950];
}
export function hpEmblemFrame(data,animation,ticks){
 const frames=data.actions[String(animation)]||[];
 const duration=frames.reduce((total,frame)=>total+Math.max(0,frame.time),0);
 let remaining=duration?ticks%duration:0;
 for(const frame of frames){if(frame.time<0||remaining<frame.time)return frame;remaining-=frame.time}
 return frames[0];
}

