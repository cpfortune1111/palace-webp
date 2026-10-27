export function applyFamilyBindController(controller,caller,api){
 const type=String(controller.type).toLowerCase();
 if(!['bindtoroot','bindtoparent'].includes(type))return false;
 const params=controller.params||{},integer=value=>Math.trunc(Number(api.evaluate(value)))|0;
 const owner=params.redirectid===undefined?caller:api.findActor(integer(params.redirectid));
 if(!owner)return true;
 const time=params.time===undefined?1:integer(params.time),scale=Math.fround(api.localScale(caller)/api.localScale(owner)),values=params.pos===undefined?[]:api.split(params.pos);
 if(params.facing!==undefined){const facing=integer(params.facing);if(facing!==0)api.setFacing(owner,Math.sign(facing))}
 const position=[0,0,0].map((fallback,index)=>values[index]===undefined?fallback:Math.fround(Math.fround(Number(api.evaluate(values[index])))*scale));
 const binder=type==='bindtoroot'?api.root(owner):api.parent(owner);
 if(binder)api.bind(owner,binder,{time,position,facing:api.getFacing(owner),targetBind:false});
 return true;
}

