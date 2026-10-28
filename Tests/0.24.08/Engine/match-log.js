// Compact numeric rows avoid retaining full controller contexts each frame.
export function createMatchLog(){
 const fields=['state','time','anim','elem','x','y','vx','vy','facing','life','ctrl','moveType','hitPause','hitShake'];
 let metadata={},frames=[],marks=[],startTick=0,active=false;
 function begin(details,tick){metadata={...details,startedAt:new Date().toISOString()};frames=[];marks=[];startTick=tick;active=true}
 function record(tick,phase,p1,p2,extra){if(!active)return;
  if(frames.length>=216000){active=false;marks.push({tick:tick-startTick,note:'Recording stopped at one-hour diagnostic limit'});return}
  frames.push([tick-startTick,phase,fields.map(k=>p1[k]??null),fields.map(k=>p2[k]??null),extra]);
 }
 function mark(tick,note='Problem marker'){const marker={number:marks.length+1,tick:tick-startTick,seconds:(tick-startTick)/60,note};marks.push(marker);return marker}
 function exportLog(){return {schema:'palace-match-log-v1',tickRate:60,metadata,fields,rowFields:['tick','phase','p1','p2','extra'],marks,frames,purpose:'Diagnostic data, not a deterministic replay'}}
 return {begin,record,mark,exportLog};
}
