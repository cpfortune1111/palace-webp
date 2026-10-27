import {parseIniSections,iniScalar} from './ini-sections.js';
import {commandKeys} from './command-symbols.js';
import {CommandMatcher} from './command-matcher.js?v=02628';
import {CommandList} from './command-list.js';
export function compileCommandFile(text,{engineVersions={ikemen:[0,0,0]},ignoreMostErrors=false,filename='fixture.cmd'}={}){
 const sections=parseIniSections(text),defaults={time:15,stepTime:-1,autoGreater:true,bufferTime:1,bufferHitPause:true,bufferPauseEnd:true,bufferShared:true},remap={},definitions=[],diagnostics=[],list=new CommandList();
 const fields={time:'time',stepTime:'steptime',autoGreater:'autogreater',bufferTime:'buffer.time',bufferHitPause:'buffer.hitpause',bufferPauseEnd:'buffer.pauseend',bufferShared:'buffer.shared'};
 const booleans=new Set(['autoGreater','bufferHitPause','bufferPauseEnd','bufferShared']);
 let readRemap=false,readDefaults=false;
 for(const section of sections){
  if(section.name==='remap'&&!readRemap){
   readRemap=true;for(const key of commandKeys.slice(15)){const mapped=section.fields[key]?.toLowerCase();if(commandKeys.slice(15).includes(mapped))remap[key]=mapped}
  }
  if(section.name==='defaults'&&!readDefaults){
   readDefaults=true;for(const [key,field] of Object.entries(fields))defaults[key]=iniScalar(section.fields,'command.'+field,defaults[key],{boolean:booleans.has(key)});
   defaults.bufferTime=Math.max(1,defaults.bufferTime);
  }
 }
 const version=engineVersions.ikemen??[0,0,0],legacy=!version[0]&&!version[1];
 for(const section of sections){
  if(!section.name.startsWith('command'))continue;
  const rawName=section.fields.name;let name='';
  if(rawName!==undefined){
   name=rawName;
   if(rawName.length<2||rawName[0]!=='"'||rawName.at(-1)!=='"')throw new SyntaxError(`${filename}:\nname: ${name}\nString not enclosed in "`);
   name=rawName.slice(1,-1);
  }
  const definition={name,command:section.fields.command??'',...defaults,remap:{...remap},ignoreParseErrors:ignoreMostErrors&&legacy};
  for(const [key,field] of Object.entries(fields))definition[key]=iniScalar(section.fields,field,definition[key],{boolean:booleans.has(key)});
  if(section.fields['buffer.time']?.length)definition.bufferTime=iniScalar(section.fields,'buffer.time',0);
  if(definition.stepTime<=0)definition.stepTime=definition.time;
  definition.bufferTime=Math.max(1,definition.bufferTime);
  let matcher;
  try{matcher=new CommandMatcher(definition.command,{...definition})}
  catch(error){if(!(error instanceof SyntaxError))throw error;throw new SyntaxError(`${filename}:\nname = ${rawName??''}\ncommand = ${definition.command}\n${error.message}`)}
  if(matcher.parseError)diagnostics.push({name,error:matcher.parseError});
  if(legacy)matcher.applyBackwardCompatibility();
  list.add(name,matcher,{shared:definition.bufferShared});definitions.push(definition);
 }
 return {defaults,remap,definitions,diagnostics,list};
}
