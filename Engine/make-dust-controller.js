import {controllerFloat32,controllerInteger} from './controller-value-conversion.js';

export function createMakeDustState(){return {elapsed:0,lastTick:-1}}

export function advanceMakeDust(state,tick,{paused=false}={}){
 if(paused||state.lastTick===tick)return;
 state.lastTick=tick;state.elapsed++;
}

export function applyMakeDustController(controller,caller,api){
 if(String(controller.type).toLowerCase()!=='makedust')return false;
 const params=controller.params??{};
 for(const name of Object.keys(params))if(!['pos','pos2','spacing','redirectid','persistent','ignorehitpause'].includes(name))throw Error('Unsupported MakeDust parameter: '+name);
 const owner=params.redirectid===undefined?caller:api.findActor(controllerInteger(api.evaluate(params.redirectid)));if(!owner)return true;
 const spacing=params.spacing===undefined?3:controllerInteger(api.evaluate(params.spacing));
 const vector=expression=>{if(expression===undefined)return [0,0,0];const components=api.split(expression);if(!components.length||components.length>3)throw Error('Invalid MakeDust position');const result=[0,0,0];for(let index=0;index<components.length;index++)result[index]=controllerFloat32(api.evaluate(components[index]));return result};
 const first=vector(params.pos),second=params.pos2===undefined?null:vector(params.pos2),state=api.state(owner);
 function emit(position){
  if(api.suppressed(owner))return;
  let interval=spacing;if(interval<1){api.warn?.('invalid MakeDust spacing');interval=1}
  if(state.elapsed<interval)return;
  state.elapsed=0;api.emit(owner,position);
 }
 emit(first);if(second)emit(second);return true;
}
