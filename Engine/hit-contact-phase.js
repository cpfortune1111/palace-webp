import {compileAttackAttribute} from './attack-attribute.js';

const throwAttributes=compileAttackAttribute(', AT');

export function hitContactPhaseAllowed(params,{sourceGettingHit,targetGettingHit,targetAttribute}={}){
 if(typeof sourceGettingHit!=='boolean'||typeof targetGettingHit!=='boolean')throw Error('Missing live contact phase input');
 if(Number(params.p1stateno??-1)>=0&&sourceGettingHit)return false;
 const attribute=typeof targetAttribute==='string'?compileAttackAttribute(targetAttribute):Number(targetAttribute??0);
 return !(targetGettingHit&&(attribute&throwAttributes)!==0);
}
