export const damageAssertionFlags=new Set(['nohitdamage','noguarddamage','noredlifedamage','nodizzypointsdamage','noguardpointsdamage']);
export const actorAssertionFlags=new Set([...damageAssertionFlags,'nowalk','noautoturn','nostandguard','nocrouchguard','unguardable']);

export function applyDamageAssertion(controller,actor,api){
 if(controller.type.toLowerCase()!=='assertspecial')return false;
 const params=controller.params||controller;
 const flags=Array.from({length:8},(_,index)=>params[index===0?'flag':'flag'+(index+1)]).filter(value=>value!==undefined).map(value=>String(value).trim().toLowerCase());
 if(!flags.some(flag=>actorAssertionFlags.has(flag)))return false;
 if(params.flag===undefined)throw Error('AssertSpecial flag not specified');
 for(const flag of flags)if(!actorAssertionFlags.has(flag))throw Error('Unsupported mixed actor assertion '+flag);
 const target=params.redirectid===undefined?actor:api.findActor(Math.trunc(Number(api.evaluate(params.redirectid)))|0);
 if(!target)return true;
 const enabled=Number(api.evaluate(params.enabled??1))!==0;
 for(const flag of flags)if(enabled)target.assertions.add(flag);else target.assertions.delete(flag);
 return true;
}
