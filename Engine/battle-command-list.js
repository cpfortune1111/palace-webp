import {CommandMatcher} from './command-matcher.js';
import {CommandList} from './command-list.js';
export function battleCommandSymbols(definition){
 if(typeof definition.command==='string')return definition.command;
 if(!Array.isArray(definition.steps))throw new TypeError('Missing command symbols/steps');
 return definition.steps.map((step,index)=>{
  const greater=step.some(key=>key.greater)?'>':'';
  return greater+step.map(key=>{
   const charge=key.charge??key.releaseMinimum??0;
   return (key.hold?'/':'')+(key.release?'~':'')+(charge>0?String(charge):'')+(key.fourway?'$':'')+key.key;
  }).join(definition.stepLogic?.[index]==='or'?'|':'+');
 }).join(',');
}
export function createBattleCommandList(definitions,{player=1,engineVersions={ikemen:[0,0,0]}}={}){
 const native=new CommandList(),wrappers=new Map(),version=engineVersions.ikemen??[0,0,0],legacy=!version[0]&&!version[1];
 for(const definition of definitions){
  const time=definition.time??15;
  const matcher=new CommandMatcher(battleCommandSymbols(definition),{time,stepTime:definition.stepTime>0?definition.stepTime:time,bufferTime:Math.max(1,definition.bufferTime??1),autoGreater:definition.autoGreater??true,bufferHitPause:definition.bufferHitPause??true,bufferPauseEnd:definition.bufferPauseEnd??true});
  if(legacy)matcher.applyBackwardCompatibility();
  native.add(definition.name,matcher,{shared:definition.bufferShared??true});
  // Existing AssertCommand/trace consumers retain their data interface.
  wrappers.set(matcher,{definition,matcher,steps:matcher.steps.map(step=>step.keys.map(key=>({...key,releaseMinimum:key.charge,greater:step.greater}))),order:matcher.order,
   get done(){return matcher.completed},get timers(){return matcher.timers},get time(){return matcher.time},set time(value){matcher.time=value|0},get buffer(){return matcher.buffer},set buffer(value){matcher.buffer=value|0}});
 }
 return {player,native,get commands(){return native.commands.map(entry=>wrappers.get(entry.matcher))},get signed(){return native.input.current},get previous(){return native.input.previous},
  sample(now,options={}){const facing=options.facing??1;native.input.update({...now,L:facing>=0?now.B:now.F,R:facing>=0?now.F:now.B});native.step({...options,helper:legacy&&!!options.helper})}};
}
