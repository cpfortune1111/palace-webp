import {controllerBoolean} from './controller-value-conversion.js';

export function applyPosFreezeController(controller,caller,api){
 const integer=expression=>{const value=api.evaluate(expression);return typeof value==='string'||value===undefined||Number.isNaN(Number(value))?0:Math.trunc(Number(value))|0};
 if(String(controller.type).toLowerCase()!=='posfreeze')return false;
 const params=controller.params||{};
 const owner=params.redirectid===undefined?caller:api.findActor(integer(params.redirectid));
 if(!owner)return true;
 api.set(owner,params.value===undefined||controllerBoolean(api.evaluate(params.value)));
 return true;
}

export function frozenPosition(previous,current,{frozen=false,boundAxes=[false,false,false],cornerPush=0}={}){
 return current.map((coordinate,axis)=>frozen&&!boundAxes[axis]?previous[axis]+(axis===0?cornerPush:0):coordinate);
}
