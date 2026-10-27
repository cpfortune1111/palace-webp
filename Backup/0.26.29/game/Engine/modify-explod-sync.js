import {controllerInteger,controllerBoolean} from './controller-value-conversion.js';

export function readModifyExplodSync(params,{evaluate}){
 const values={};for(const name of ['synclayer','syncparams','syncid'])if(params[name]!==undefined)values[name]=name==='syncparams'?controllerBoolean(evaluate(params[name])):controllerInteger(evaluate(params[name]));return values;
}
export function applyModifyExplodSync(effect,ownerId,values){
 effect.syncId??=-1;effect.syncLayer??=0;effect.syncParams??=true;
 if(values.synclayer!==undefined)effect.syncLayer=values.synclayer;
 if(values.syncparams!==undefined)effect.syncParams=values.syncparams;
 if(values.syncid!==undefined)effect.syncId=values.syncid===-1?ownerId:values.syncid;
}
