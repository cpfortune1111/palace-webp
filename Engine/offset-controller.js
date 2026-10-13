export function applyOffsetController(controller,caller,api){
 if(String(controller.type).toLowerCase()!=='offset')return false;
 const params=controller.params||{};
 const owner=params.redirectid===undefined?caller:api.findActor(Math.trunc(Number(api.evaluate(params.redirectid)))|0);
 if(!owner)return true;
 for(const [axis,name] of ['x','y'].entries())if(params[name]!==undefined)api.set(owner,axis,Math.fround(Math.fround(Number(api.evaluate(params[name])))*api.localScale(caller)));
 return true;
}

export function offsetDrawingPosition(position,offset,localScale=1){
 return position.map((coordinate,axis)=>coordinate+(offset[axis]||0)/localScale);
}