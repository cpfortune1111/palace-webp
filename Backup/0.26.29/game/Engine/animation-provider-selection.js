import {controllerInteger} from './controller-value-conversion.js';
export function animationProviderSelection(params,{second=false,own,stateOwner=own,evaluate,findActor,playerOf,characterAt}){
 let animation=-1,sprite=-1,read=-1;
 if(!second){if(params.animplayerno!==undefined)animation=controllerInteger(evaluate(params.animplayerno))-1;if(params.spriteplayerno!==undefined)sprite=controllerInteger(evaluate(params.spriteplayerno))-1}
 if(params.readplayerid!==undefined){const actor=findActor(controllerInteger(evaluate(params.readplayerid)));if(!actor)return null;read=playerOf(actor)-1}
 if(second)return {animation:read<0?stateOwner:characterAt(read)??own,sprite:own};
 if(animation<0&&sprite<0&&read!==-1)animation=sprite=read;
 return {animation:animation<0?own:characterAt(animation)??own,sprite:sprite<0?own:characterAt(sprite)??own};
}
