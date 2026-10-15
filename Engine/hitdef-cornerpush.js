import {compileAttackAttribute} from './attack-attribute.js';

export const cornerPushParameterNames=Object.freeze(['ground','air','down','guard','airguard'].flatMap(prefix=>[prefix+'.cornerpush.veloff',prefix+'.cornerpush.velmul']));

export function hitDefCornerPush(params,{velocities,ikemen=false,legacyDefault,evaluate=Number}={}){
 const legacy=legacyDefault===undefined||legacyDefault<0?!ikemen:legacyDefault>0;
 const result={},evaluated={};
 for(const prefix of ['air','down','ground','guard','airguard'])for(const field of ['velmul','veloff']){
  const name=prefix+'.cornerpush.'+field;
  if(params[name]!==undefined)evaluated[name]=Math.fround(Number(evaluate(params[name])));
 }
 const read=(name,fallback)=>{
  const value=evaluated[name]??NaN;
  result[name]=Number.isNaN(value)?Math.fround(fallback):value;
  return result[name];
 };
 const groundOffset=read('ground.cornerpush.veloff',legacy?(compileAttackAttribute(params.attr??'S, NA',{hitdef:true})&4?0:Math.fround(velocities.guard[0])*1.3):velocities.ground[0]);
 const groundMultiplier=read('ground.cornerpush.velmul',legacy?0.7:-1);
 for(const prefix of ['air','down','guard','airguard']){
  read(prefix+'.cornerpush.veloff',groundOffset);
  read(prefix+'.cornerpush.velmul',groundMultiplier);
 }
 return result;
}
