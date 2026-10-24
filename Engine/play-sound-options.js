import {controllerBoolean,controllerFloat32,controllerInteger,controllerInteger64} from './controller-value-conversion.js?v=02581';

export function compilePlaySoundOptions(params,evaluate,channel=-1,versions=null){
 const options={lowPriority:params.lowpriority===undefined?false:controllerBoolean(evaluate(params.lowpriority)),priority:0,panParams:{pan:0,absolute:false},volume:100};
 if(params.pan!==undefined)options.panParams={pan:controllerFloat32(evaluate(params.pan)),absolute:false};
 if(params.abspan!==undefined)options.panParams={pan:controllerFloat32(evaluate(params.abspan)),absolute:true};
 if(params.volume!==undefined)options.volume=(options.volume+Math.trunc(controllerInteger(evaluate(params.volume))*25/128))|0;
 if(params.volumescale!==undefined)options.volume=controllerInteger(evaluate(params.volumescale));
 const playback={freqMul:1,loopCount:0,loopStart:0,loopEnd:0,startPosition:0};
 if(params.freqmul!==undefined)playback.freqMul=Math.max(Math.fround(.01),Math.min(5,controllerFloat32(evaluate(params.freqmul))));
 const looping=params.loop===undefined?false:controllerBoolean(evaluate(params.loop));
 if(params.priority!==undefined)options.priority=controllerInteger(evaluate(params.priority));
 for(const [name,key]of [['loopstart','loopStart'],['loopend','loopEnd'],['startposition','startPosition']])if(params[name]!==undefined)playback[key]=controllerInteger64(evaluate(params[name]));
 if(params.loopcount!==undefined)playback.loopCount=controllerInteger(evaluate(params.loopcount));
 options.stopFlags={hit:params.stopongethit===undefined?channel===0:controllerBoolean(evaluate(params.stopongethit)),state:params.stoponchangestate===undefined?false:controllerBoolean(evaluate(params.stoponchangestate))};
 if(playback.loopCount===0&&looping){playback.loopCount=-1;if(params.volumescale===undefined&&!versions?.ikemen?.[0]&&!versions?.ikemen?.[1])options.volume=100}
 if(['freqmul','loop','loopstart','loopend','startposition','loopcount'].some(name=>params[name]!==undefined))options.playback=playback;
 return options;
}
