import {parseCommandSymbols,commandKeys} from './command-symbols.js';
const isDirection=k=>commandKeys.indexOf(k.key)>=0&&commandKeys.indexOf(k.key)<15;
function forwardPair(first,next){
 if(next.keys.some(k=>k.hold)||first.keys.some(k=>!isDirection(k)))return false;
 if(first.keys.some(k=>next.keys.some(n=>k.key===n.key)))return false;
 return next.keys.some(k=>!isDirection(k)&&!k.release)||first.keys.some(k=>k.release)&&next.keys.some(k=>!isDirection(k)||!k.release);
}
function equal(first,next){return first.greater===next.greater&&JSON.stringify(first.keys)===JSON.stringify(next.keys)}
export class CommandMatcher{
 constructor(symbols,{time=1,stepTime=0,bufferTime=1,autoGreater=false,bufferHitPause=false,bufferPauseEnd=false,remap={}}={}){
  const parsed=parseCommandSymbols(symbols,{remap});
  if(parsed.error)throw new SyntaxError(parsed.error);
  this.steps=parsed.steps;
  if(autoGreater){
   const original=this.steps;this.steps=[];
   for(let i=0;i<original.length;i++){
    const current=original[i],previous=original[i-1];
    if(i&&previous.keys.length===1&&current.keys.length===1&&isDirection(previous.keys[0])&&isDirection(current.keys[0])&&equal(previous,current)){
     const key=current.keys[0];
     this.steps.push({greater:true,orLogic:false,keys:[{key:key.key,hold:false,release:!key.release,fourway:key.fourway,charge:0}]},{greater:true,orLogic:false,keys:current.keys});
    }else this.steps.push(current);
   }
  }
  this.order=[];
  for(let end=this.steps.length-1;end>=0;){let start=end;while(start>0&&forwardPair(this.steps[start-1],this.steps[start]))start--;for(let i=start;i<=end;i++)this.order.push(i);end=start-1}
  this.maxTime=time|0;this.maxStepTime=stepTime|0;this.maxBuffer=bufferTime|0;
  this.bufferHitPause=!!bufferHitPause;this.bufferPauseEnd=!!bufferPauseEnd;
  this.completed=this.steps.map(()=>false);this.timers=this.steps.map(()=>0);
  this.time=0;this.buffer=0;this.complete=false;
 }
 clear(resetBuffer=false){this.time=0;if(resetBuffer)this.buffer=0;this.completed.fill(false);this.timers.fill(0)}
 applyBackwardCompatibility(){
  for(const step of this.steps)if(!step.orLogic&&step.keys.some(key=>key.hold))for(const key of step.keys)key.hold=true;
  if(this.steps.length&&this.steps.every(step=>step.keys.every(key=>key.hold)))this.maxBuffer=1;
 }
 greaterFails(step,input){
  const lr=step.keys.some(k=>/[LR]/.test(k.key));
  const keys=['U','D',...(lr?['L','R','UL','UR','DL','DR']:['B','F','UF','UB','DF','DB']),...commandKeys.slice(15)];
  return keys.some(key=>{
   // The reference tests release only if the press case did not return.
   if(input.state({key})===1)return !step.keys.some(k=>k.key===key&&!k.release);
   return input.state({key,release:true})===1&&!step.keys.some(k=>k.key===key&&k.release);
  });
 }
 step(input,{ai=false,helper=false,hitPause=false,pauseEnd=false,extra=0}={}){
  extra|=0;
  if(!this.bufferHitPause){hitPause=false;extra=0}
  if(!this.bufferPauseEnd){pauseEnd=false;extra=0}
  if(this.buffer>0&&!hitPause&&!pauseEnd)this.buffer=(this.buffer-1)|0;
  if(!this.steps.length)return;
  let any=false;
  for(let i=0;i<this.steps.length;i++)if(this.completed[i]){
   this.timers[i]=(this.timers[i]+1)|0;
   if(this.maxStepTime>0&&this.timers[i]>this.maxStepTime){this.completed[i]=false;this.timers[i]=0;continue}
   any=true;
  }
  if(any)this.time=(this.time+1)|0;else if(this.time>0)this.clear();
  for(const i of this.order){
   if(i>0&&!this.completed[i-1])continue;
   const step=this.steps[i];
   if(ai&&helper&&!step.keys.some(k=>k.hold))return;
   const matches=k=>{const t=input.state(k);return (k.hold?t>0:t===1)&&!(k.charge>1&&input.charge(k)<k.charge)};
   let matched=step.orLogic?step.keys.some(matches):step.keys.every(matches);
   if(step.greater&&i>0&&this.steps.length>=2&&this.completed[i-1]&&!this.completed[i]&&this.greaterFails(step,input)){
    matched=false;this.completed[i-1]=false;this.timers[i-1]=0;
   }
   if(matched){this.completed[i]=true;this.timers[i]=0;if(i>0){this.completed[i-1]=false;this.timers[i-1]=0}else this.time=0}
  }
  this.complete=this.completed.at(-1)===true;
  if(!this.complete&&(ai||this.time<this.maxTime))return;
  this.clear();
  if(this.complete)this.buffer=Math.max(this.buffer,(this.maxBuffer+extra)|0);
 }
}
