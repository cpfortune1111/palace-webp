import {createAngleState} from './angle-controllers.js';
import {controllerFloat32} from './controller-value-conversion.js';

export function compileExplodAngles(params,evaluate){
 const state=createAngleState();
 for(const [parameter,field] of [['angle','value'],['yangle','yangle'],['xangle','xangle']])if(params[parameter]!==undefined){
  state[field]=controllerFloat32(evaluate(params[parameter]));state.enabled=true;
 }
 return state;
}
