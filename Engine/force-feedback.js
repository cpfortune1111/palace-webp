import {controllerInteger} from './controller-value-conversion.js';
function unsigned16(value){return (Math.trunc(Number(value))|0)&65535}
export function createForceFeedback(output){
 const legacy=new Map();
 function execute(params,caller,api){
  let target=params.redirectid===undefined?caller:api.findActor(controllerInteger(api.evaluate(params.redirectid)));
  if(!target)return;
  const waveform=String(params.waveform??'sine').toLowerCase();
  const time=(Math.trunc(Number(api.evaluate(params.time??60)))|0)>>>0;
  const readVector=name=>{
   const values=[128,0,0,0];
   if(params[name]!==undefined)api.split(params[name]).slice(0,4).forEach((expression,index)=>{values[index]=Math.fround(Number(api.evaluate(expression)))});
   return values;
  };
  readVector('freq');
  const amplitude=readVector('ampl'),self=Number(api.evaluate(params.self??1))!==0;
  const modern=params.lo!==undefined||params.hi!==undefined;
  const low=params.lo===undefined?0:unsigned16(api.evaluate(params.lo));
  const high=params.hi===undefined?0:unsigned16(api.evaluate(params.hi));
  if(modern){output(target,low,high,time);return}
  if(!self)target=api.opponent(target);
  if(!target||target.kind==='helper')return;
  legacy.set(api.controllerKey(target),{target,time,amplitude,waveform});
 }
 function step(){
  for(const [key,effect] of legacy){
   if(!effect.time){legacy.delete(key);continue}
   const remaining=effect.time;
   const first=Math.fround(Math.pow(effect.amplitude[1],remaining));
   const second=Math.fround(Math.pow(effect.amplitude[2],remaining*remaining));
   const third=Math.fround(Math.pow(second,remaining*remaining*remaining));
   const sum=Math.fround(Math.fround(Math.fround(effect.amplitude[0]+first)+second)+third);
   const intensity=unsigned16(Math.fround(Math.fround(sum/255)*65535));
   const shape=['off','sine','square','sinesquare'].includes(effect.waveform)?effect.waveform:'sine';
   output(effect.target,shape==='sine'||shape==='sinesquare'?intensity:0,shape==='square'||shape==='sinesquare'?intensity:0,1);
   effect.time--;
  }
 }
 return {execute,step,reset:()=>legacy.clear()};
}

export function browserRumble(gamepad,low,high,ticks,{logicSpeed=60,turbo=1}={}){
 const actuator=gamepad?.vibrationActuator;
 if(!actuator?.playEffect||logicSpeed<=0||turbo<=0)return false;
 const frameMilliseconds=Math.ceil(1000*turbo/logicSpeed);
 const duration=ticks>0?ticks*frameMilliseconds+(frameMilliseconds>>>1):0;
 try{
  const result=actuator.playEffect('dual-rumble',{duration,strongMagnitude:ticks>0?low/65535:0,weakMagnitude:ticks>0?high/65535:0,startDelay:0});
  result?.catch?.(()=>{});
  return true;
 }catch{return false}
}
