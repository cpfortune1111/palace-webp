import {CommandInputBuffer} from './command-input-buffer.js';
// Groups retain first-name insertion order, matching native Commands[][] layout.
export class CommandList{
 constructor(buffer=new CommandInputBuffer()){this.input=buffer;this.groups=new Map()}
 add(name,matcher,{shared=true}={}){
  if(!this.groups.has(name))this.groups.set(name,[]);
  this.groups.get(name).push({name,matcher,shared:!!shared});
 }
 get commands(){return [...this.groups.values()].flat()}
 active(name){return (this.groups.get(name)??[]).some(entry=>entry.matcher.buffer>0)}
 assert(name,time){const entries=this.groups.get(name);if(!entries)return false;for(const entry of entries)entry.matcher.buffer=time|0;return entries.length>0}
 clearName(name){for(const entry of this.groups.get(name)??[])if(!entry.matcher.complete&&entry.shared)entry.matcher.clear()}
 step(options={}){
  if(!this.input)return;
  const completed=new Set();
  for(const entry of this.commands){
   const command=entry.matcher;command.step(this.input,options);
   if(command.complete){command.clear();completed.add(entry.name);command.complete=false}
  }
  for(const name of completed)this.clearName(name);
 }
}
