import {selectiveGetHitReset} from './get-hit-selective-reset.js';
import {hitReactionMetadata} from './hit-reaction-metadata.js';
import {hitFallShakeData} from './hit-fall-shake-data.js';

export function reversalFallDefinition(params,{evaluate=Number,resetOptions}={}){
 const integer=value=>Math.trunc(Number(evaluate(value)))|0,boolean=value=>Number(evaluate(value))!==0,float=value=>Math.fround(Number(evaluate(value))),defaults=selectiveGetHitReset({},resetOptions),reaction=hitReactionMetadata(params),fall=params.fall===undefined?false:boolean(params.fall),result={attr:params.attr??0,id:params.id??0,fall,'air.fall':params['air.fall']===undefined?fall:boolean(params['air.fall']),forcenofall:params.forcenofall===undefined?false:boolean(params.forcenofall),'fall.animtype':reaction['fall.animtype']};
 for(const [parameter,name,fallback] of [['fall.xvelocity','fall.xvel',null],['fall.yvelocity','fall.yvel',defaults['fall.yvel']],['fall.zvelocity','fall.zvel',0]])result[name]=params[parameter]===undefined?fallback:float(params[parameter]);
 for(const [name,fallback] of [['fall.recovertime',4],['fall.damage',0],['down.recovertime',-1]])result[name]=params[name]===undefined?fallback:integer(params[name]);
 for(const [name,fallback] of [['fall.recover',true],['fall.kill',true],['down.recover',true]])result[name]=params[name]===undefined?fallback:boolean(params[name]);
 const shake={};
 for(const name of ['time','ampl','freq','phase','mul','dir'])if(params['fall.envshake.'+name]!==undefined)shake['fall.envshake.'+name]=['time','ampl'].includes(name)?integer(params['fall.envshake.'+name]):float(params['fall.envshake.'+name]);
 return {...result,...hitFallShakeData(shake)};
}
