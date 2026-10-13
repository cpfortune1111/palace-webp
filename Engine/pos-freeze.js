export function applyPosFreezeController(controller,caller,api){
 if(String(controller.type).toLowerCase()!=='posfreeze')return false;
 const params=controller.params||{};
 const owner=params.redirectid===undefined?caller:api.findActor(Math.trunc(Number(api.evaluate(params.redirectid)))|0);
 if(!owner)return true;
 api.set(owner,params.value===undefined||Number(api.evaluate(params.value))!==0);
 return true;
}

export function frozenPosition(previous,current,{frozen=false,boundAxes=[false,false,false],cornerPush=0}={}){
 return current.map((coordinate,axis)=>frozen&&!boundAxes[axis]?previous[axis]+(axis===0?cornerPush:0):coordinate);
}