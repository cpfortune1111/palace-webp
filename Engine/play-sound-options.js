import {controllerBoolean,controllerFloat32,controllerInteger} from './controller-value-conversion.js';

export function compilePlaySoundOptions(params,evaluate,channel=-1){
 const options={lowPriority:params.lowpriority===undefined?false:controllerBoolean(evaluate(params.lowpriority)),priority:0,panParams:{pan:0,absolute:false},volume:100};
 if(params.pan!==undefined)options.panParams={pan:controllerFloat32(evaluate(params.pan)),absolute:false};
 if(params.abspan!==undefined)options.panParams={pan:controllerFloat32(evaluate(params.abspan)),absolute:true};
 if(params.volume!==undefined)options.volume=(options.volume+Math.trunc(controllerInteger(evaluate(params.volume))*25/128))|0;
 if(params.volumescale!==undefined)options.volume=controllerInteger(evaluate(params.volumescale));
 if(params.priority!==undefined)options.priority=controllerInteger(evaluate(params.priority));
 options.stopFlags={hit:params.stopongethit===undefined?channel===0:controllerBoolean(evaluate(params.stopongethit)),state:params.stoponchangestate===undefined?false:controllerBoolean(evaluate(params.stoponchangestate))};
 return options;
}
