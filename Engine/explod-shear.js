import {controllerFloat32} from './controller-value-conversion.js';

export function compileExplodShear(expression,evaluate){return expression===undefined?0:controllerFloat32(evaluate(expression))}

export function applyExplodShear(context,{value,zoom=1,verticalScale,height,axisY,angle}){
 if(!value)return;
 const coefficient=value*zoom,rotated=angle?.enabled&&(angle.value!==0||angle.xangle!==0||angle.yangle!==0);
 if(rotated)context.translate(-coefficient*verticalScale*(height-axisY),0);
 context.transform(1,0,rotated?coefficient:-coefficient,1,0,0);
}
