const integer=value=>Math.trunc(Number(value))|0;
const omitted=-2147483648;

export function hitUnhittableTime(params,{pause=[0,0],reversal=false,throwAttribute=false,evaluate=Number,split=value=>String(value).split(',')}={}){
 const values=params.unhittabletime===undefined?[]:split(params.unhittabletime);
 if(values.length>2||values.some(value=>String(value).trim()===''))throw Error('Invalid unhittabletime component count');
 const supplied=values.map(value=>integer(evaluate(value))),result=[supplied[0]??omitted,supplied[1]??omitted];
 if(result.includes(omitted)){
  const extra=integer(integer(pause[0])+1);
  if(reversal)result[1]=extra;
  if(throwAttribute)result.fill(extra);
  for(let index=0;index<2;index++)if(result[index]===omitted)result[index]=-1;
 }
 return result;
}
