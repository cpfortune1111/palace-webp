export function createExplodAnimationClock(frames,loopStart=0,age=0){
 if(!frames)throw Error('Missing Explod animation frames');
 if(!frames.length)return {times:[],loop:0,total:0,loopTime:0,elem:0,time:0,draw:0,curtime:0,loopEnd:age>0,loopCount:0,targetElem:1,targetTime:0,frozen:false};
 const times=frames.map(frame=>Number(frame.time)),loop=Math.max(0,Math.min(frames.length-1,Math.trunc(loopStart)));
 if(times.slice(0,-1).some(time=>time<0))throw Error('Unsupported nonterminal negative Explod frame');
 const held=times.at(-1)===-1,total=held?-1:times.reduce((sum,time)=>sum+Math.max(0,time),0),loopTime=times.slice(loop).reduce((sum,time)=>sum+Math.max(0,time),0);
 if(total===0)throw Error('Unsupported all-zero Explod animation');
 const clock={times,loop,total,loopTime,elem:0,time:0,draw:0,curtime:0,loopEnd:false,loopCount:0,targetElem:1,targetTime:0,frozen:false};
 for(let remaining=Math.max(0,Math.trunc(age));remaining>0;remaining--){
  if(clock.loopCount>0&&loopTime>0&&remaining>=loopTime){const cycles=Math.floor(remaining/loopTime);clock.loopCount+=cycles;remaining-=cycles*loopTime;if(!remaining)break}
  if(held&&clock.elem===times.length-1){clock.time+=remaining;clock.curtime+=remaining;clock.draw=clock.elem;break}
  stepExplodAnimationClock(clock);
 }
 return clock;
}
function seekClock(clock,elem,time){
 if(!clock.times.length){Object.assign(clock,{targetElem:1,targetTime:0,elem:0,time:0,draw:0,curtime:0,loopEnd:false,loopCount:0});return}
 clock.targetElem=elem<1||elem>clock.times.length?1:elem;
 const duration=clock.times[clock.targetElem-1];clock.targetTime=time<0||duration!==-1&&time>=duration?0:time;
 clock.elem=clock.targetElem-1;clock.time=clock.targetTime;
 if(clock.total>0)while(clock.elem<clock.times.length-1&&clock.times[clock.elem]<=0)clock.elem++;
 clock.draw=clock.elem;clock.curtime=clock.times.slice(0,clock.elem).reduce((sum,value)=>sum+Math.max(0,value),0)+clock.time;clock.loopEnd=false;clock.loopCount=0;
}
export function modifyExplodAnimationClock(clock,changes){
 if(changes.animelem!==undefined){stepExplodAnimationClock(clock);seekClock(clock,changes.animelem,0)}
 if(changes.animelemtime!==undefined)seekClock(clock,clock.targetElem,changes.animelemtime);
 if(changes.animfreeze!==undefined)clock.frozen=changes.animfreeze;
}
export function stepExplodAnimationClock(clock){
 if(clock.frozen){seekClock(clock,clock.targetElem,clock.targetTime);return}
 if(!clock.times.length){clock.loopEnd=true;return}
 if(clock.total>0){
  if(clock.curtime>=clock.total){clock.time=0;clock.elem=clock.loop}
  while(clock.elem<clock.times.length-1&&clock.times[clock.elem]<=0)clock.elem++;
 }
 clock.draw=clock.elem;
 const next=()=>{if(clock.total!==-1||clock.elem<clock.times.length-1){clock.time=0;do{clock.elem++}while(clock.elem<clock.times.length&&!(clock.total===-1&&clock.elem===clock.times.length-1)&&clock.times[clock.elem]<=0)}};
 if(clock.times[clock.elem]<=0)next();
 if(clock.elem<clock.times.length){clock.time++;if(clock.time>=clock.times[clock.elem]){next();if(clock.elem>=clock.times.length)clock.elem=clock.loop}}else clock.elem=clock.loop;
 if(clock.total!==-1&&clock.curtime>=clock.total){clock.curtime=clock.total-clock.loopTime;clock.loopCount++}
 clock.curtime++;if(clock.total!==-1&&clock.curtime>=clock.total)clock.loopEnd=true;
}
