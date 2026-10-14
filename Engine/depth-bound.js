export function createDepthBoundFlags(playerType=true){return {enabled:playerType,moveCamera:playerType}}

export function applyDepthBoundController(controller,caller,api){
 if(String(controller.type).toLowerCase()!=='depthbound')return false;
 const params=controller.params||{},owner=params.redirectid===undefined?caller:api.findActor(Math.trunc(Number(api.evaluate(params.redirectid)))|0);if(!owner)return true;
 const flags=api.flags(owner);flags.enabled=Number(api.evaluate(params.value??0))!==0;flags.moveCamera=Number(api.evaluate(params.movecamera??0))!==0;
 return true;
}

export function boundedDepthPosition(position,edge,bounds,{localScale=1,stageBound=true,depthBound=true}={}){
 if(!stageBound||!depthBound)return position;
 const minimum=Math.fround(edge[0]+Math.fround(bounds[0]/localScale)),maximum=Math.fround(-edge[1]+Math.fround(bounds[1]/localScale));
 if(position<minimum)return minimum;
 if(position>maximum)return maximum;
 return position;
}
