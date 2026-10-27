const flags={H:1,L:2,A:4,D:8,F:16,P:32,'-':64,'+':128,M:3};

export function guardFlagMask(value){
 if(typeof value==='number')return value|0;
 let mask=0;
 for(const character of String(value??'').trim().toUpperCase()){if(flags[character]===undefined)throw Error('Invalid guard flag '+character);mask|=flags[character]}
 return mask;
}

export function guardFlagString(value){
 const mask=guardFlagMask(value);let result='';
 for(const character of ['H','L','A','F','D','P','-','+'])if(mask&flags[character])result+=character;
 return result;
}

export function guardFlagMatches(value,pattern){return !!(guardFlagMask(value)&guardFlagMask(pattern))}
