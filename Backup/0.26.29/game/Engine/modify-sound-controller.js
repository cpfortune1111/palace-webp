import {controllerBoolean,controllerFloat32,controllerInteger,controllerInteger64} from './controller-value-conversion.js?v=02581';

export function applyModifySoundController(controller,caller,api){
 if(String(controller.type).toLowerCase()!=='modifysnd')return false;
 const params=controller.params||{},target=params.redirectid===undefined?caller:api.findActor(controllerInteger(api.evaluate(params.redirectid)));
 if(!target)return true;
 for(const name of Object.keys(params))if(!['redirectid','channel','pan','abspan','volume','volumescale','freqmul','priority','loopstart','loopend','position','loop','loopcount','stopongethit','stoponchangestate','ignorehitpause','persistent'].includes(name))throw Error('Unsupported ModifySnd parameter: '+name);
 const changes={},channel=params.channel===undefined?-1:controllerInteger(api.evaluate(params.channel));
 if(params.pan!==undefined)changes.pan={pan:controllerFloat32(api.evaluate(params.pan)),absolute:false};
 if(params.abspan!==undefined)changes.pan={pan:controllerFloat32(api.evaluate(params.abspan)),absolute:true};
 if(params.volume!==undefined){const value=Math.fround(controllerInteger(api.evaluate(params.volume)));changes.volume=Math.fround(Math.fround(100+Math.fround(value*Math.fround(25/128)))*Math.fround(128/25))}
 if(params.volumescale!==undefined)changes.volume=Math.fround(Math.trunc((api.ownVolume(target)*controllerInteger(api.evaluate(params.volumescale))|0)/100));
 if(params.freqmul!==undefined)changes.freqMul=Math.max(Math.fround(.01),Math.min(5,controllerFloat32(api.evaluate(params.freqmul))));
 if(params.priority!==undefined)changes.priority=controllerInteger(api.evaluate(params.priority));
 for(const [name,key]of [['loopstart','loopStart'],['loopend','loopEnd']])if(params[name]!==undefined)changes[key]=controllerInteger64(api.evaluate(params[name]));
 if(params.position!==undefined)changes.position=controllerInteger64(api.evaluate(params.position));
 if(params.loop!==undefined)changes.repeatCount=controllerBoolean(api.evaluate(params.loop))?-1:0;
 if(params.loopcount!==undefined){const value=controllerInteger(api.evaluate(params.loopcount));changes.repeatCount=value<0?-1:Math.max(value-1,0)}
 if(params.stopongethit!==undefined)changes.hit=controllerBoolean(api.evaluate(params.stopongethit));
 if(params.stoponchangestate!==undefined)changes.state=controllerBoolean(api.evaluate(params.stoponchangestate));
 api.modify(target,channel,changes);return true;
}
