const integer=value=>Math.trunc(Number(value))|0;
const product=(first,second)=>integer(Math.fround(Math.fround(first)*Math.fround(second)));

export function hitPowerParameters(params,{constants={},evaluate=Number,split=value=>String(value).split(',')}={}){
 const damage=integer(split(params.damage??0)[0]);
 const superAttack=String(params.attr??'').split(',').slice(1).some(value=>/^H[ATP]$/.test(value.trim().toUpperCase()));
 const prefix=superAttack?'super':'default';
 const result={};
 for(const [parameter,direction,fallback] of [['getpower','attack',superAttack?0:0.7],['givepower','gethit',0.6]]){
  const supplied=params[parameter]===undefined?[]:split(params[parameter]);
  if(supplied.length>2||supplied.some(value=>String(value).trim()===''))throw Error('Invalid '+parameter+' component count');
  const hit=supplied[0]===undefined?product(constants[prefix+'.'+direction+'.lifetopowermul']??fallback,damage):integer(evaluate(supplied[0]));
  const guard=supplied[1]===undefined?product(hit,0.5):integer(evaluate(supplied[1]));
  result[parameter==='getpower'?'hitGetPower':'hitGivePower']=hit;
  result[parameter==='getpower'?'guardGetPower':'guardGivePower']=guard;
 }
 return result;
}
