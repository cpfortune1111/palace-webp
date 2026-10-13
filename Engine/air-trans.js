export function airTransState(blend,{strict=true}={}){
 if(!blend)return {type:'none',alpha:[255,0]};
 const text=String(blend).trim().toLowerCase(),start=text.search(/[as]/),token=start<0?text:text.slice(start);
 const invalid=()=>{if(strict)throw Error('Invalid animation element transparency: '+blend)};
 if(token==='a1')return {type:'add',alpha:[255,128]};
 const match=token.match(/^(sas|as|ss)(\d*)(?:d(\d*))?$/);
 if(match){const type=match[1]==='sas'?'subadd':match[1]==='ss'?'sub':'add',defaults=type==='add'?[255,0]:[255,255],number=(text,fallback)=>text?Math.min(255,Number(BigInt(text)&16383n)):fallback;return {type,alpha:[number(match[2],defaults[0]),number(match[3],defaults[1])]}}
 if(token==='sa')return {type:'subadd',alpha:[255,255]};
 if(token==='a')return {type:'add',alpha:[255,255]};
 if(token==='s')return {type:'sub',alpha:[255,255]};
 invalid();return {type:'none',alpha:[255,0]};
}

export function resolveSpriteTrans(state,blend,options){
 return !state||state.type==='default'?airTransState(blend,options):state;
}