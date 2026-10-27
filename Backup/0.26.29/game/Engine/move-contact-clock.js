export function createMoveContactClock(){return {type:'hit',time:0,countered:false}}

export function markMoveContact(clock,type,{countered=false}={}){
 if(!['hit','guarded','reversed'].includes(type))throw Error('Invalid move contact type');
 clock.type=type;clock.time=-1;clock.countered=countered;
 return clock;
}

export function moveContactQuery(clock,name){
 const time=Math.abs(clock.time),key=name.toLowerCase();
 if(key==='movecontact')return clock.type==='reversed'?0:time;
 if(key==='movehit')return clock.type==='hit'?time:0;
 if(key==='moveguarded')return clock.type==='guarded'?time:0;
 if(key==='movereversed')return clock.type==='reversed'?time:0;
 if(key==='movecountered')return clock.countered?time:0;
 throw Error('Unknown move contact query '+name);
}

export function advanceMoveContact(clock,{paused=false}={}){if(!paused&&clock.time>0)clock.time++;return clock}
export function finishMoveContact(clock){if(clock.time<0)clock.time=1;return clock}
export function clearMoveContact(clock){clock.time=0;clock.countered=false;return clock}
