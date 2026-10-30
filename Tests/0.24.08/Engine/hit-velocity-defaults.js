// A missing guard X velocity inherits ground X. Guard Y stays zero.
// Missing components use defaults; invalid explicit values are reported, not hidden.
export function hitVelocityVector(params,prefix){
 const parse=(value,label,fallback)=>{
  const values=value===undefined?fallback:String(value).split(',').map(Number);
  const result=[values[0]??0,values[1]??0];
  if(result.some(n=>!Number.isFinite(n)))throw Error('Invalid HitDef '+label+': '+value);
  return result;
 };
 const ground=parse(params['ground.velocity'],'ground.velocity',[0,0]);
 return parse(params[prefix+'.velocity'],prefix+'.velocity',prefix==='guard'?[ground[0],0]:[0,0]);
}
