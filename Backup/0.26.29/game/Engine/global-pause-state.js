// Pinned native timer/allowance operations. The caller owns engine phase placement.
const fresh=()=>({time:0,buffer:0,player:0,endBuffer:0,background:false});
export class GlobalPauseState{
 constructor(actors=[]){this.normal=fresh();this.super=fresh();this.actors=actors;this.byId=new Map(actors.map(actor=>[actor.id,actor]))}
 set(slot,actor,{time=0,moveTime=0,endBuffer=0,background=true,unhittable=false,defenceMultiplier=1}={}){
  time|=0;moveTime|=0;endBuffer|=0;
  const state=this[slot],key=slot==='super'?'superMoveTime':'pauseMoveTime';
  state.background=!!background;state.endBuffer=endBuffer;
  if((~time)<state.buffer||state.player===actor.player||actor.player!==actor.statePlayer){
   state.buffer=~time;state.player=actor.player;
   if(state.endBuffer<0||state.endBuffer>time)state.endBuffer=0;
  }
  actor[key]=Math.max(0,moveTime);
  if(actor[key]>time)actor[key]=0;
  else if(state.time>0&&actor[key]>0)actor[key]=(actor[key]-1)|0;
  if(slot==='super'){
   const extended=(time+Number(time>0))|0;
   if(unhittable)actor.unhittableTime=extended;
   actor.ignoreDarkenTime=extended;this.propagateIgnoreDarken(actor);
   const multiplier=Math.fround(defenceMultiplier);
   if(multiplier!==1)for(const other of this.actors)if(other.team!==actor.team)other.defenceMultiplier=Math.fround(other.defenceMultiplier*multiplier);
  }
 }
 propagateIgnoreDarken(actor){
  const value=actor.ignoreDarkenTime;let top=actor;
  if(!actor.ownPal)for(;;){const parent=this.byId.get(top.parent);if(!parent)break;top=parent;if(top.ownPal)break}
  top.ignoreDarkenTime=value;const stack=[top];
  while(stack.length){const node=stack.pop();for(const id of node.children){const child=this.byId.get(id);if(!child||child.ownPal)continue;child.ignoreDarkenTime=value;stack.push(child)}}
 }
 advanceTimers(){
  if(this.super.time>0)this.super.time=(this.super.time-1)|0;
  else if(this.normal.time>0)this.normal.time=(this.normal.time-1)|0;
  for(const state of [this.super,this.normal])if(state.buffer<0){state.buffer=~state.buffer;state.time=state.buffer}
 }
 prepare(actor,{hasCommandList=true,hitPause=false}={}){
  actor.paused=false;
  if(hasCommandList){if(this.super.time>0)actor.paused=actor.superMoveTime===0;else if(this.normal.time>0&&actor.pauseMoveTime===0)actor.paused=true}
  actor.previousSuperMoveTime=actor.superMoveTime;actor.previousPauseMoveTime=actor.pauseMoveTime;
  actor.actionTemporary=actor.paused?-2:0;
  if(!actor.paused&&!hitPause){if(this.super.time>0){if(actor.superMoveTime>0)actor.superMoveTime=(actor.superMoveTime-1)|0}else if(this.normal.time>0&&actor.pauseMoveTime>0)actor.pauseMoveTime=(actor.pauseMoveTime-1)|0}
 }
 resetTimers(){for(const state of [this.normal,this.super]){state.time=0;state.buffer=0}}
}
