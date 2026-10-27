const integer=value=>Math.trunc(Number(value))|0;

export function hitPauseParameters(params,{evaluate=Number,split=value=>String(value).split(',')}={}){
 function components(name){
  if(params[name]===undefined)return [];
  const values=split(params[name]);
  if(values.length>2||values.some(value=>String(value).trim()===''))throw Error('Invalid '+name+' component count');
  return values.map(value=>integer(evaluate(value)));
 }
 const supplied=components('pausetime'),pause=[supplied[0]??0,supplied[1]??0],guard=components('guard.pausetime');
 return {pause,guard:pause.map((fallback,index)=>guard[index]===undefined||guard[index]===-2147483648?fallback:guard[index])};
}
