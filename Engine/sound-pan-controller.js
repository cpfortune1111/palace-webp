import {controllerFloat32,controllerInteger} from './controller-value-conversion.js';

export function applySoundPanController(controller,caller,api){
 if(String(controller.type).toLowerCase()!=='sndpan')return false;
 const params=controller.params||{};
 if(params.channel===undefined)throw Error('Missing SndPan channel');
 const target=params.redirectid===undefined?caller:api.findActor(controllerInteger(api.evaluate(params.redirectid)));
 if(!target)return true;
 for(const name of Object.keys(params))if(!['redirectid','channel','pan','abspan','ignorehitpause','persistent'].includes(name))throw Error('Unsupported SndPan parameter: '+name);
 const channel=controllerInteger(api.evaluate(params.channel));
 let pan=0;if(params.pan!==undefined)pan=controllerFloat32(api.evaluate(params.pan));
 const absolute=params.abspan!==undefined;if(absolute)pan=controllerFloat32(api.evaluate(params.abspan));
 api.setPan(target,channel,{pan,absolute});return true;
}
