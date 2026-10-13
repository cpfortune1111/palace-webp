import {compileAttackAttribute} from './attack-attribute.js';

function matches(mask,attribute,{attackerState,projectile=false,compatibility='ikemen'}={}){
 const flags=compileAttackAttribute(mask),attack=compileAttackAttribute(attribute,{hitdef:true});
 const state=compatibility==='mugen'&&!projectile?({S:1,C:2,A:4,L:8,N:16}[String(attackerState).toUpperCase()]??attack&63):attack&63;
 return [Boolean(flags&state),Boolean(flags&attack&~63)];
}

export function excludesHit(mask,attribute,options){const [state,attack]=matches(mask,attribute,options);return state||attack}
export function allowsHit(mask,attribute,options){const [state,attack]=matches(mask,attribute,options);return state&&attack}