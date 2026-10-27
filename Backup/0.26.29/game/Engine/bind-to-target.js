export function applyBindToTargetController(controller,caller,api){
 if(String(controller.type).toLowerCase()!=='bindtotarget')return false;
 const params=controller.params||{},integer=value=>Math.trunc(Number(api.evaluate(value)))|0;
 const owner=params.redirectid===undefined?caller:api.findActor(integer(params.redirectid));
 if(!owner)return true;
 const id=params.id===undefined?-1:integer(params.id),index=params.index===undefined?0:integer(params.index),time=params.time===undefined?1:integer(params.time);
 const scale=Math.fround(api.localScale(caller)/api.localScale(owner)),values=params.pos===undefined?[]:api.split(params.pos);
 let x=values[0]===undefined?0:Math.fround(Math.fround(Number(api.evaluate(values[0])))*scale),y=values[1]===undefined?NaN:Math.fround(Math.fround(Number(api.evaluate(values[1])))*scale);
 const z=params.posz===undefined?NaN:Math.fround(Math.fround(Number(api.evaluate(params.posz)))*scale),anchor=values[2]===undefined?'f':String(values[2]).trim()[0]?.toLowerCase();
 if(!['h','m','f'].includes(anchor))throw Error('Invalid BindToTarget position type');
 const selected=api.targets(owner).select(id,index,api.findActor),target=api.findActor(selected[0]);
 if(!target)return true;
 if(anchor!=='f'){const offset=api.anchor(target,anchor),anchorScale=Math.fround((320/api.localCoord(target))/api.localScale(owner));x=Math.fround(x+Math.fround(offset[0]*anchorScale));y=Math.fround(y+Math.fround(offset[1]*anchorScale))}
 const ratio=Math.fround(api.localScale(target)/api.localScale(owner)),positions=[owner.x,owner.y,owner.z??0];
 [x,y,z].forEach((offset,axis)=>{if(!Number.isNaN(offset))positions[axis]=Math.fround(Math.fround((target[['x','y','z'][axis]]??0)*ratio)+Math.fround(offset*(axis===0?target.facing:1)))});
 api.move(owner,positions,{axes:[!Number.isNaN(x),!Number.isNaN(y),!Number.isNaN(z)]});
 const targetRatio=Math.fround(api.localScale(owner)/api.localScale(target)),distance=Math.fround(Math.fround(target.x*ratio)-positions[0]);
 const bindPosition=[Math.abs(distance)<0.0001?0:Math.fround(owner.facing*distance),Math.fround(Math.fround(target.y*ratio)-Math.fround(positions[1]*targetRatio)),Math.fround(Math.fround((target.z??0)*ratio)-Math.fround(positions[2]*targetRatio))].map(value=>Math.fround(value*targetRatio));
 api.bind(target,owner,{time,facing:0,position:bindPosition,targetBind:true});
 return true;
}

