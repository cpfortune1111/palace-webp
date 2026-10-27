import {controllerInteger} from './controller-value-conversion.js';

export function applyRoundTimeController(controller,api){
 const type=String(controller.type).toLowerCase();if(!['roundtimeadd','roundtimeset'].includes(type))return false;
 const params=controller.params??{};
 if(params.value===undefined)throw Error('Missing '+controller.type+' value');
 for(const name of Object.keys(params))if(!['value','redirectid','persistent','ignorehitpause'].includes(name))throw Error('Unsupported '+controller.type+' parameter: '+name);
 const {current,maximum}=api.time();if(maximum===-1)return true;
 const value=controllerInteger(api.evaluate(params.value)),next=type==='roundtimeadd'?(current+value)|0:value;
 api.setTime(Math.max(0,Math.min(maximum,next)));return true;
}
