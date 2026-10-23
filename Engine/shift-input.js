import {controllerInteger} from './controller-value-conversion.js';
const keys=['U','D','L','R','a','b','c','x','y','z','s','d','w','m'];

function inputKey(value){
 const key=String(value);
 if(keys.includes(key))return key;
 if(key.toLowerCase()==='none')return null;
 throw Error('Invalid ShiftInput key: '+key);
}

export function applyShiftInputController(controller,caller,api){
 if(String(controller.type).toLowerCase()!=='shiftinput')return false;
 const params=controller.params||{};
 if(params.input===undefined||params.output===undefined)throw Error('ShiftInput requires input and output');
 const source=inputKey(params.input),destination=inputKey(params.output);
 const owner=params.redirectid===undefined?caller:api.findActor(controllerInteger(api.evaluate(params.redirectid)));
 if(!owner)return true;
 if(source===null){if(destination===null)api.clear(caller);return true}
 api.set(owner,source,destination);return true;
}

export function createShiftInputState(){
 const actors=new Map();
 return {
  set(key,source,destination){let mapping=actors.get(key);if(!mapping){mapping=new Map();actors.set(key,mapping)}mapping.set(source,destination)},
  take(key){const mapping=actors.get(key)||new Map();actors.delete(key);return mapping},
  clear(key){if(key===undefined)actors.clear();else actors.delete(key)}
 };
}

export function shiftCommandInput(input,mapping,facing){
 if(!mapping.size)return input;
 const canonical=key=>key==='L'?(facing>=0?'B':'F'):key==='R'?(facing>=0?'F':'B'):key;
 const result={...input};
 for(const key of keys)result[canonical(key)]=false;
 for(const key of keys){
  if(!input[canonical(key)])continue;
  const destination=mapping.has(key)?mapping.get(key):key;
  if(destination!==null)result[canonical(destination)]=true;
 }
 return result;
}
