import {controllerInteger} from './controller-value-conversion.js';
import {applyPaletteRemap} from './palette-remap-state.js';

export function applyRemapPaletteController(controller,caller,api){
 if(String(controller.type).toLowerCase()!=='remappal')return false;
 const params=controller.params??{};
 if(params.dest===undefined)throw Error('Missing RemapPal dest');
 for(const name of Object.keys(params))if(!['source','dest','redirectid','persistent','ignorehitpause'].includes(name))throw Error('Unsupported RemapPal parameter: '+name);
 const owner=params.redirectid===undefined?caller:api.findActor(controllerInteger(api.evaluate(params.redirectid)));if(!owner)return true;
 const pair=expression=>{const values=api.split(expression);if(!values.length||values.length>2)throw Error('Invalid RemapPal palette pair');return [controllerInteger(api.evaluate(values[0])),values[1]===undefined?0:controllerInteger(api.evaluate(values[1]))]};
 const source=params.source===undefined?[-1,0]:pair(params.source),destination=pair(params.dest);
 const {state,catalog}=api.palette(owner);applyPaletteRemap(state,catalog,source,destination,{warn:api.warn});return true;
}
