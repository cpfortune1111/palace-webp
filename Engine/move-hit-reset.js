import {controllerInteger} from './controller-value-conversion.js';

export function applyMoveHitResetController(controller,caller,api){
 if(String(controller.type).toLowerCase()!=='movehitreset')return false;
 const params=controller.params||{};
 const target=params.redirectid===undefined?caller:api.findActor(controllerInteger(api.evaluate(params.redirectid)));
 if(!target)return true;
 for(const name of Object.keys(params))if(!['redirectid','ignorehitpause','persistent'].includes(name))throw Error('Unsupported MoveHitReset parameter: '+name);
 api.clear(target);
 return true;
}
