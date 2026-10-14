import {compileAttackAttribute} from './attack-attribute.js';
import {guardFlagMask} from './get-hit-guard-flag.js';
import {compileCollisionGroup} from './hitdef-collision-group.js';

export function prepareReversalDefinition(params){
 if(params['reversal.attr']===undefined)throw Error('ReversalDef reversal.attr not specified');
 const reversalMask=compileAttackAttribute(params['reversal.attr']);
 for(const name of ['reversal.guardflag','reversal.guardflag.not'])if(params[name]!==undefined)guardFlagMask(params[name]);
 const p2clsncheck=params.p2clsncheck??'clsn1';compileCollisionGroup(p2clsncheck);
 return {...params,reversalMask,p2clsncheck};
}
