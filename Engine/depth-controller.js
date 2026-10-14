export function createDepthModifiers(){return {player:[0,0],edge:[0,0]}}

export function applyDepthController(controller,caller,api){
 if(String(controller.type).toLowerCase()!=='depth')return false;
 const params=controller.params||{},specific=params.player!==undefined||params.edge!==undefined;
 if(!specific&&params.value===undefined)throw Error('Missing Depth value');
 const owner=params.redirectid===undefined?caller:api.findActor(Math.trunc(Number(api.evaluate(params.redirectid)))|0);if(!owner)return true;
 const ratio=Math.fround(api.localCoord(owner)/api.localCoord(caller)),slots=api.slots(owner);
 const pair=expression=>{const values=api.split(expression);return [0,0].map((fallback,index)=>values[index]===undefined?fallback:Math.fround(Math.fround(Number(api.evaluate(values[index])))*ratio))};
 if(specific){for(const field of ['edge','player'])if(params[field]!==undefined&&String(params[field]).trim()!=='')slots[field]=pair(params[field])}
 else {const values=pair(params.value);slots.player=values.slice();slots.edge=values.slice()}
 return true;
}
