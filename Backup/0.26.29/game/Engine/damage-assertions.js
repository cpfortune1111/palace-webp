import {controllerBoolean} from './controller-value-conversion.js';

export const damageAssertionFlags=new Set(['nohitdamage','noguarddamage','noredlifedamage','nodizzypointsdamage','noguardpointsdamage']);
export const actorAssertionFlags=new Set([...damageAssertionFlags,'nowalk','noautoturn','nofacep2','noturntarget','nojugglecheck','nostandguard','nocrouchguard','noairguard','unguardable','noko','noguardko','nokofall','nokovelocity','nocornerpush','nofallhitflag','nogetupfromliedown','noshadow','nomakedust']);

export function applyDamageAssertion(controller,actor,api){
 if(controller.type.toLowerCase()!=='assertspecial')return false;
 const params=controller.params||controller;
 const flags=Array.from({length:8},(_,index)=>params[index===0?'flag':'flag'+(index+1)]).filter(value=>value!==undefined).map(value=>String(value).trim().toLowerCase());
 if(!flags.some(flag=>actorAssertionFlags.has(flag)))return false;
 if(params.flag===undefined)throw Error('AssertSpecial flag not specified');
 for(const flag of flags)if(!actorAssertionFlags.has(flag))throw Error('Unsupported mixed actor assertion '+flag);
 let target=actor;
 if(params.redirectid!==undefined){const value=api.evaluate(params.redirectid),id=typeof value==='string'||value===undefined||Number.isNaN(Number(value))?0:Math.trunc(Number(value))|0;target=api.findActor(id)}
 if(!target)return true;
 const enabled=controllerBoolean(api.evaluate(params.enabled??1));
 for(const flag of flags)if(enabled)target.assertions.add(flag);else target.assertions.delete(flag);
 return true;
}
