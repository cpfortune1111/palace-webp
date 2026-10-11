export function excludesHit(mask,attribute){
 const [states,...excluded]=String(mask).toUpperCase().split(',').map(value=>value.trim());
 const [state,attack]=String(attribute).toUpperCase().split(',').map(value=>value.trim());
 if(!state||states&&!states.includes(state))return false;
 if(!excluded.length)return true;
 return excluded.some(value=>value.length===2&&attack?.length===2&&(value[0]==='A'||value[0]===attack[0])&&value[1]===attack[1]);
}
