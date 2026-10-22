import {controllerBoolean} from './controller-value-conversion.js';

export function createDepthBoundFlags(playerType=true){return {enabled:playerType,moveCamera:playerType}}

export function applyDepthBoundController(controller,caller,api){
 const integer=expression=>{const value=api.evaluate(expression);return typeof value==='string'||value===undefined||Number.isNaN(Number(value))?0:Math.trunc(Number(value))|0};
 if(String(controller.type).toLowerCase()!=='depthbound')return false;
 const params=controller.params||{},owner=params.redirectid===undefined?caller:api.findActor(integer(params.redirectid));if(!owner)return true;
 const flags=api.flags(owner);flags.enabled=controllerBoolean(api.evaluate(params.value??0));flags.moveCamera=controllerBoolean(api.evaluate(params.movecamera??0));
 return true;
}

export function boundedDepthPosition(position,edge,bounds,{localScale=1,stageBound=true,depthBound=true}={}){
 if(!stageBound||!depthBound)return position;
 const minimum=Math.fround(edge[0]+Math.fround(bounds[0]/localScale)),maximum=Math.fround(-edge[1]+Math.fround(bounds[1]/localScale));
 if(position<minimum)return minimum;
 if(position>maximum)return maximum;
 return position;
}
