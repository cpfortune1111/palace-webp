import {controllerInteger} from './controller-value-conversion.js';

export function applyGravityController(controller,caller,api){
 if(String(controller.type).toLowerCase()!=='gravity')return false;
 const params=controller.params||{};
 const target=params.redirectid===undefined?caller:api.findActor(controllerInteger(api.evaluate(params.redirectid)));
 if(!target)return true;
 for(const name of Object.keys(params))if(!['redirectid','ignorehitpause','persistent'].includes(name))throw Error('Unsupported Gravity parameter: '+name);
 const ownScale=Math.fround(api.ownScale(target)),stateScale=Math.fround(api.stateScale(target));
 if(!(ownScale>0&&stateScale>0&&Number.isFinite(ownScale)&&Number.isFinite(stateScale)))throw Error('Invalid Gravity coordinate scale');
 const acceleration=Math.fround(Math.fround(api.acceleration(target))*Math.fround(ownScale/stateScale));
 api.setVelocity(target,Math.fround(Math.fround(api.velocity(target))+acceleration));
 return true;
}
