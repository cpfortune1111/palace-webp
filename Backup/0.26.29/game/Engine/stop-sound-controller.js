import {controllerInteger} from './controller-value-conversion.js';

export function applyStopSoundController(controller,caller,api){
 if(String(controller.type).toLowerCase()!=='stopsnd')return false;
 const params=controller.params||{};
 if(params.channel===undefined)throw Error('Missing StopSnd channel');
 const target=params.redirectid===undefined?caller:api.findActor(controllerInteger(api.evaluate(params.redirectid)));
 if(!target)return true;
 for(const name of Object.keys(params))if(!['redirectid','channel','ignorehitpause','persistent'].includes(name))throw Error('Unsupported StopSnd parameter: '+name);
 const channel=controllerInteger(api.evaluate(params.channel));
 if(channel===-1)api.stopAll();else api.stopOwner(target,channel);
 return true;
}
