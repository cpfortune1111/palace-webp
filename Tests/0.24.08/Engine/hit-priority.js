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
