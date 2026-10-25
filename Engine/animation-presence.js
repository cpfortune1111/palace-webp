import {controllerInteger} from './controller-value-conversion.js';
export function changeAnimationNumber(value){const number=controllerInteger(value);return number<0&&number!==-2?0:number}
export function animationPresence(number,frames,element=1){
 if(number===-2)return {exists:true,frame:false};
 const exists=number!==-1&&Array.isArray(frames);return {exists,frame:exists&&frames[Math.max(0,element-1)]!==undefined};
}
export function changeAnimationElement(frames,element,time){
 let elem=controllerInteger(element),tick=controllerInteger(time);
 if(!Array.isArray(frames))return null;
 if(elem<1||elem>frames.length)return {elem:1,tick:0};
 const duration=Number(frames[elem-1].time);
 if(tick<0||(duration!==-1&&tick>=duration))tick=0;
 return {elem,tick};
}
