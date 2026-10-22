import {controllerBoolean} from './controller-value-conversion.js';

export function createScreenBoundFlags(playerType=true){return {screenBound:playerType,stageBound:true,moveCamera:[playerType,playerType]}}

export function applyScreenBoundController(controller,caller,api){
 const integer=expression=>{const value=api.evaluate(expression);return typeof value==='string'||value===undefined||Number.isNaN(Number(value))?0:Math.trunc(Number(value))|0};
 if(String(controller.type).toLowerCase()!=='screenbound')return false;
 const params=controller.params||{},evaluate=expression=>controllerBoolean(api.evaluate(expression));
 const owner=params.redirectid===undefined?caller:api.findActor(integer(params.redirectid));
 if(!owner)return true;
 const flags=api.flags(owner);
 flags.screenBound=params.value===undefined?false:evaluate(params.value);
 const values=params.movecamera===undefined?[]:api.split(params.movecamera);
 flags.moveCamera[0]=values[0]===undefined?false:evaluate(values[0]);
 flags.moveCamera[1]=values[1]===undefined?false:evaluate(values[1]);
 if(params.stagebound!==undefined)flags.stageBound=evaluate(params.stagebound);
 return true;
}

export function screenBoundInterval(flags,screen,stage,edges={left:0,right:0}){
 let left=-Infinity,right=Infinity;
 if(flags.screenBound){left=screen.left+edges.left;right=screen.right-edges.right}
 if(flags.stageBound){left=Math.max(left,stage.left);right=Math.min(right,stage.right)}
 return {left,right};
}
