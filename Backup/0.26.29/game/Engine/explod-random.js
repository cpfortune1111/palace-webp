import {controllerFloat32} from './controller-value-conversion.js';

export function sampleExplodRandom(expression,{evaluate,split,randomFloat,scale=1}){
 const result=[0,0,0];if(expression===undefined)return result;
 const components=split(expression);if(!components.length||components.length>3)throw Error('Invalid Explod random vector');
 for(const [axis,component] of components.entries()){
  const half=Math.fround(Math.fround(controllerFloat32(evaluate(component))/2)*Math.fround(scale));
  result[axis]=Math.fround(randomFloat(-half,half));
 }
 return result;
}
