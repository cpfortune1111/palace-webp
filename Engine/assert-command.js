import {controllerInteger} from './controller-value-conversion.js';

export function assertCommandBuffers(lists,name,time,{randomIndex,warn=()=>{}}){
 if(name===''){
  const commands=lists[0]?.commands??[],names=[...new Set(commands.map(command=>command.definition.name))];
  if(!names.length)return 0;
  name=names[randomIndex(names.length)];
  if(name===undefined)throw Error('Invalid random command selection');
  if(time<=0)time=Math.max(1,commands.find(command=>command.definition.name===name).definition.bufferTime??0);
 }
 let count=0;
 for(const list of lists)for(const command of list.commands)if(command.definition.name===name){command.buffer=time;command.assertedByController=true;count++}
 if(!count)warn('attempted to assert an invalid command: '+name);
 return count;
}

export function applyAssertCommandController(controller,caller,api){
 if(String(controller.type).toLowerCase()!=='assertcommand')return false;
 const params=controller.params??{},name=String(params.name??'').trim();
 if(name.length<2||name[0]!=='"'||name.at(-1)!=='"')throw Error('Command name not enclosed in "');
 const target=params.redirectid===undefined?caller:api.findActor(controllerInteger(api.evaluate(params.redirectid)));
 if(!target)return true;
 for(const key of Object.keys(params))if(!['name','buffer.time','redirectid','persistent','ignorehitpause'].includes(key))throw Error('Unsupported AssertCommand parameter: '+key);
 const time=params['buffer.time']===undefined?1:controllerInteger(api.evaluate(params['buffer.time']));
 api.assert(target,name.slice(1,-1),time);return true;
}
