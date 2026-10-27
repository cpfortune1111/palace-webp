// Source: pinned Ikemen anim.go ReadAnimFrame alpha branch. Diagnostics are
// separate from the selected state because native parsing retains both.
export function parseAirTransState(blend){
 const text=String(blend??'').trim().toLowerCase(),state={type:'none',alpha:[255,0]},diagnostics=[];
 if(!text)return {state,diagnostics};
 const start=text.search(/[as]/),token=start<0?text:text.slice(start);
 const invalid=()=>diagnostics.push({code:'invalid-animation-transparency',message:'Invalid animation element transparency: '+token});
 const alpha=(offset,destination)=>{
  let index=offset;
  const digits=()=>{let value=0;while(index<token.length&&token.charCodeAt(index)>=48&&token.charCodeAt(index)<=57){value=(value*10+token.charCodeAt(index++)-48)&16383}return Math.min(255,value)};
  // Native always assigns the source accumulator, including when no digit was
  // read. Destination changes only when D is followed by at least one digit.
  const source=digits();
  if(token[index]==='d'&&token.charCodeAt(index+1)>=48&&token.charCodeAt(index+1)<=57){index++;destination=digits()}
  return [source,destination];
 };
 if(token==='a1'){state.type='add';state.alpha=[255,128]}
 else if(token.startsWith('sas')){state.type='subadd';state.alpha=alpha(3,255)}
 else if(token.startsWith('sa')){state.type='subadd';state.alpha=[255,255];if(token.length>2)invalid()}
 else if(token.startsWith('as')){state.type='add';state.alpha=alpha(2,0)}
 else if(token.startsWith('ss')){state.type='sub';state.alpha=alpha(2,255)}
 else if(token[0]==='a'){state.type='add';state.alpha=[255,255];if(token.length>1)invalid()}
 else if(token[0]==='s'){state.type='sub';state.alpha=[255,255];if(token.length>1)invalid()}
 else invalid();
 return {state,diagnostics};
}

export function airTransState(blend,{strict=true}={}){
 const {state,diagnostics}=parseAirTransState(blend);
 if(strict&&diagnostics.length)throw Error(diagnostics[0].message);
 return state;
}

export function resolveSpriteTrans(state,blend,options){
 return !state||state.type==='default'?airTransState(blend,options):state;
}
