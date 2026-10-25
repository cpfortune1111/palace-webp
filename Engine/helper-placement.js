import {controllerInteger,controllerFloat32} from './controller-value-conversion.js';
const f=Math.fround;

export function readHelperPlacement(params,api){
 const postype=String(params.postype??'p1').trim().toLowerCase();if(!['p1','p2','front','back','left','right','none'].includes(postype))throw Error('Invalid Helper postype '+postype);
 const position=[0,0,0],source=params.pos??params.offset;
 if(source!==undefined){const parts=api.split(source);if(!parts.length||parts.length>3)throw Error('Invalid Helper pos vector');const ratio=f(api.callerScale/api.ownerScale);for(const [axis,expression] of parts.entries())position[axis]=f(controllerFloat32(api.evaluate(expression))*ratio)}
 const facing=params.facing===undefined?1:controllerInteger(api.evaluate(params.facing));
 const pausemovetime=params.pausemovetime===undefined?0:controllerInteger(api.evaluate(params.pausemovetime)),supermovetime=params.supermovetime===undefined?0:controllerInteger(api.evaluate(params.supermovetime));
 return {postype,position,facing,pausemovetime,supermovetime};
}

export function helperPlacement(owner,values,{worldScale=1,opponent=null,left=0,right=0}={}){
 const {postype,position}=values,flip=values.facing<0?-1:1;let facing=flip,local=[0,0,0];
 const actorPosition=actor=>['x','y','z'].map(axis=>f(Number(actor[axis]??0)/worldScale));
 const relative=actor=>{const base=actorPosition(actor);return [f(base[0]+f(position[0]*actor.facing)),f(base[1]+position[1]),f(base[2]+position[2])]};
 if(postype==='p1'){local=relative(owner);facing*=owner.facing}
 else if(postype==='p2'){if(opponent){local=relative(opponent);facing*=opponent.facing}}
 else if(postype==='front'||postype==='back'){const edge=owner.facing>0&&postype==='front'||owner.facing<0&&postype==='back'?right:left;local=[f(f(edge/worldScale)+f(position[0]*owner.facing)),position[1],position[2]];facing*=owner.facing}
 else if(postype==='left'||postype==='right')local=[f(f((postype==='left'?left:right)/worldScale)+position[0]),position[1],position[2]];
 else local=[...position];
 return {x:f(local[0]*worldScale),y:f(local[1]*worldScale),z:f(local[2]*worldScale),facing,pausemovetime:values.pausemovetime,supermovetime:values.supermovetime};
}
