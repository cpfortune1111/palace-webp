import {controllerBoolean,controllerInteger} from './controller-value-conversion.js';

export function createEnvironmentColor(){return {color:[255,255,255],remaining:0,under:false}}

export function applyEnvironmentColor(controller,state,{evaluate,split}){
 if(String(controller.type).toLowerCase()!=='envcolor')return false;
 const params=controller.params??{};
 for(const name of Object.keys(params))if(!['value','time','under','persistent','ignorehitpause'].includes(name))throw Error('Unsupported EnvColor parameter: '+name);
 const components=params.value===undefined?null:split(params.value);if(components&&components.length<3)throw Error('Not enough arguments in EnvColor value');
 state.color=[255,255,255];state.remaining=1;state.under=false;
 if(components)for(let index=0;index<3;index++)state.color[index]=controllerInteger(evaluate(components[index]));
 if(params.time!==undefined)state.remaining=controllerInteger(evaluate(params.time));
 if(params.under!==undefined)state.under=controllerBoolean(evaluate(params.under));
 return true;
}

export function stepEnvironmentColor(state){if(state.remaining>0)state.remaining--}

export function paintEnvironmentColor(context,state){
 if(state.remaining===0)return false;
 context.save();context.setTransform(1,0,0,1,0,0);context.globalAlpha=1;context.globalCompositeOperation='source-over';context.fillStyle='rgb('+state.color.map(value=>value&255).join(',')+')';context.fillRect(0,0,context.canvas.width,context.canvas.height);context.restore();return true;
}
