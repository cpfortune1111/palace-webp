export function compileHitPriority(value,{evaluate=Number}={}){
 const parts=String(value??'4, Hit').split(',').map(part=>part.trim());
 if(parts.length>2||!parts[0])throw Error('Invalid HitDef priority '+value);
 const kind=parts[1]??'Hit';if(!['hit','miss','dodge'].includes(kind.toLowerCase()))throw Error('Invalid HitDef priority type '+kind);
 return (Math.trunc(Number(evaluate(parts[0])))|0)+', '+kind;
}

export function resolveHitPriority(first,second){
 const parse=value=>{
  const [number,kind='Hit']=String(value??'4, Hit').split(',').map(part=>part.trim());
  const priority=Number(number),type=kind.toLowerCase();
  if(!Number.isFinite(priority)||!['hit','miss','dodge'].includes(type))throw Error('Invalid HitDef priority '+value);
  return {priority,type};
 };
 const left=parse(first),right=parse(second);
 if(left.priority!==right.priority)return [left.priority>right.priority,right.priority>left.priority];
 if(left.type==='dodge'||right.type==='dodge')return [false,false];
 return [left.type==='hit',right.type==='hit'];
}
