export function createResultStateWatchdog(){
 const players=new Map();
 function reset(){players.clear()}
 function step(player,{state,anim,frame,infinite=false}){
  let record=players.get(player);
  if(!record||record.state!==state||record.anim!==anim){record={state,anim,frame,loops:0,held:0};players.set(player,record);return false}
  if(frame<record.frame)record.loops++;
  record.held=frame===record.frame&&infinite?record.held+1:0;record.frame=frame;
  return record.loops>=2||record.held>=1200;
 }
 return {reset,step};
}

