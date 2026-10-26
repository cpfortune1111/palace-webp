import {CommandMatcher} from './command-matcher.js?v=02628';
import {CommandList} from './command-list.js';
import {compileCommandFile} from './command-file.js';
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
export function createBattleCommandList(definitions,{player=1,engineVersions={ikemen:[0,0,0]},ignoreMostErrors=false,filename='fixture.cmd'}={}){
 if(typeof definitions==='string')definitions=compileCommandFile(definitions,{engineVersions,ignoreMostErrors,filename}).definitions;
 const native=new CommandList(),wrappers=new Map(),version=engineVersions.ikemen??[0,0,0],legacy=!version[0]&&!version[1];
 for(const definition of definitions){
  const time=definition.time??15;
  const matcher=new CommandMatcher(battleCommandSymbols(definition),{time,stepTime:definition.stepTime>0?definition.stepTime:time,bufferTime:Math.max(1,definition.bufferTime??1),autoGreater:definition.autoGreater??true,bufferHitPause:definition.bufferHitPause??true,bufferPauseEnd:definition.bufferPauseEnd??true,remap:definition.remap??{},ignoreParseErrors:!!definition.ignoreParseErrors});
  if(legacy)matcher.applyBackwardCompatibility();
  native.add(definition.name,matcher,{shared:definition.bufferShared??true});
  // Existing AssertCommand/trace consumers retain their data interface.
  wrappers.set(matcher,{definition,matcher,steps:matcher.steps.map(step=>step.keys.map(key=>({...key,releaseMinimum:key.charge,greater:step.greater}))),order:matcher.order,
   get done(){return matcher.completed},get timers(){return matcher.timers},get time(){return matcher.time},set time(value){matcher.time=value|0},get buffer(){return matcher.buffer},set buffer(value){matcher.buffer=value|0}});
 }
 return {player,native,get commands(){return native.commands.map(entry=>wrappers.get(entry.matcher))},get diagnostics(){return native.commands.filter(entry=>entry.matcher.parseError).map(entry=>({name:entry.name,error:entry.matcher.parseError}))},get signed(){return native.input.current},get previous(){return native.input.previous},
  sample(now,options={}){const facing=options.facing??1;native.input.update({...now,L:facing>=0?now.B:now.F,R:facing>=0?now.F:now.B});native.step({...options,helper:options.helperRestricted??(legacy&&!!options.helper)})}};
}
