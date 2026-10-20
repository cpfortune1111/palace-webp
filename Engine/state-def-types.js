export function applyStateDefTypes(definition,{set}){
 if(!definition)return false;
 for(const [name,fallback]of [['type','S'],['moveType','I'],['physics','N']]){
  const value=String(definition[name]??fallback).toUpperCase();
  if(value!=='U')set(name,value);
 }
 return true;
}
