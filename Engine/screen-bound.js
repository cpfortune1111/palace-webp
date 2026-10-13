export function createScreenBoundFlags(playerType=true){return {screenBound:playerType,stageBound:true,moveCamera:[playerType,playerType]}}

export function applyScreenBoundController(controller,caller,api){
 if(String(controller.type).toLowerCase()!=='screenbound')return false;
 const params=controller.params||{},evaluate=expression=>Number(api.evaluate(expression))!==0;
 const owner=params.redirectid===undefined?caller:api.findActor(Math.trunc(Number(api.evaluate(params.redirectid)))|0);
 if(!owner)return true;
 const flags=api.flags(owner);
 flags.screenBound=params.value===undefined?false:evaluate(params.value);
 const values=params.movecamera===undefined?[]:api.split(params.movecamera);
 flags.moveCamera=[values[0]===undefined?false:evaluate(values[0]),values[1]===undefined?false:evaluate(values[1])];
 if(params.stagebound!==undefined)flags.stageBound=evaluate(params.stagebound);
 return true;
}

export function screenBoundInterval(flags,screen,stage,edges={left:0,right:0}){
 let left=-Infinity,right=Infinity;
 if(flags.screenBound){left=screen.left+edges.left;right=screen.right-edges.right}
 if(flags.stageBound){left=Math.max(left,stage.left);right=Math.min(right,stage.right)}
 return {left,right};
}

