import {controllerInteger} from './controller-value-conversion.js';
export function createWidthModifiers(){return {player:[0,0],edge:[0,0]}}

export function applyWidthController(controller,caller,api){
 if(String(controller.type).toLowerCase()!=='width')return false;
 const params=controller.params||{};
 const explicit=params.edge!==undefined||params.player!==undefined;
 if(!explicit&&params.value===undefined)throw Error('Missing Width value');
 const owner=params.redirectid===undefined?caller:api.findActor(controllerInteger(api.evaluate(params.redirectid)));
 if(!owner)return true;
 const scale=Math.fround(api.localCoord(owner)/api.localCoord(caller));
 const pair=expression=>{const values=api.split(expression);return [0,0].map((fallback,index)=>values[index]===undefined?fallback:Math.fround(Math.fround(Number(api.evaluate(values[index])))*scale))};
 if(explicit){for(const field of ['edge','player'])if(params[field]!==undefined&&String(params[field]).trim()!=='')api.write(owner,field,pair(params[field]))}
 else {const values=pair(params.value);api.write(owner,'player',[...values]);api.write(owner,'edge',[...values])}
 return true;
}

export function widthWorldExtents(front,back,facing,modifiers=[0,0],normalize=true){
 let forward=front+modifiers[0],rear=back+modifiers[1];
 if(normalize&&-rear>forward)[forward,rear]=[-rear,-forward];
 return facing>0?{left:rear,right:forward}:{left:forward,right:rear};
}
