export function hitFallShakeData(params,recipientRatio=1,{copyExtended=false}={}){
 const values={time:0,ampl:-4,freq:60,phase:NaN,mul:1,dir:0,...(copyExtended?{diradd:0,decay:0}:{})},result={};
 for(const name of Object.keys(values)){
  let value=Number(params['fall.envshake.'+name]??values[name]);
  if(name==='time'||name==='ampl')value=Math.trunc(value)|0;
  else value=Math.fround(value);
  if(name==='freq')value=Math.max(0,value);
  if(name==='ampl')value=Math.trunc(Math.fround(Math.fround(value)*Math.fround(recipientRatio)))|0;
  result['fall.envshake.'+name]=value;
 }
 return result;
}
