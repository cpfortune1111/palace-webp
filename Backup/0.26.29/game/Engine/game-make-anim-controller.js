import {controllerBoolean,controllerFloat32,controllerInteger} from './controller-value-conversion.js';
import {compileAnimationReference} from './animation-reference.js';

export function applyGameMakeAnimController(controller,caller,api){
 if(String(controller.type).toLowerCase()!=='gamemakeanim')return false;
 const params=controller.params??{};
 for(const name of Object.keys(params))if(!['redirectid','pos','random','under','value','persistent','ignorehitpause'].includes(name))throw Error('Unsupported GameMakeAnim parameter: '+name);
 const recipient=params.redirectid===undefined?caller:api.findActor(controllerInteger(api.evaluate(params.redirectid)));
 if(!recipient)return true;
 const effect=api.allocate(recipient);if(!effect)return true;
 effect.id=0;effect.layerno=1;effect.sprpriority=-2147483648;effect.ownpal=true;
 const ratio=controllerFloat32(api.localScale(caller)/api.localScale(recipient)),position=[0,0,0];
 function components(expression){const values=api.split(expression);if(!values.length||values.length>3)throw Error('Invalid GameMakeAnim vector');return values}
 if(params.pos!==undefined)for(const [index,expression] of components(params.pos).entries())position[index]=controllerFloat32(controllerFloat32(api.evaluate(expression))*ratio);
 if(params.random!==undefined)for(const [index,expression] of components(params.random).entries()){
  const half=controllerFloat32(controllerFloat32(controllerFloat32(api.evaluate(expression))/2)*ratio);
  position[index]=controllerFloat32(position[index]+api.randomFloat(-half,half));
 }
 if(params.under!==undefined&&controllerBoolean(api.evaluate(params.under)))effect.layerno=0;
 if(params.value!==undefined)api.animation(effect,recipient,compileAnimationReference(params.value,{split:api.split,evaluate:api.evaluate,commonDefault:true,prefixes:api.prefixes??[]}));
 const offset=api.drawOffset(recipient);
 position[0]=controllerFloat32(position[0]-controllerFloat32(offset[0]));position[1]=controllerFloat32(position[1]-controllerFloat32(offset[1]));
 api.place(effect,recipient,position);api.commit(effect,recipient);return true;
}
