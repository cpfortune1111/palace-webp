// helper.Run evaluates name as a string; BytecodeValue.ToS maps other values to "".
export function readHelperName(params,parentName,{evaluate,loose=false}){
 if(params.name===undefined)return String(parentName??'')+"'s helper";
 try{const value=evaluate(params.name);return typeof value==='string'?value:''}
 catch(error){
  if(!loose)throw error;
  // Native legacy ignoreMostErrors fallback removes quotes only as a pair.
  const raw=String(params.name).trim();return raw.length>=2&&raw[0]==='"'&&raw.at(-1)==='"'?raw.slice(1,-1):raw;
 }
}
