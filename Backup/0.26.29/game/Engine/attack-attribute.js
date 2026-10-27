const states={S:1,C:2,A:4};
const attacks={NA:64,NT:128,NP:256,SA:512,ST:1024,SP:2048,HA:4096,HT:8192,HP:16384,AA:4672,AT:9344,AP:18688,N:448,S:3584,H:28672,A:28672};

export function compileAttackAttribute(value,{hitdef=false,ignoreMostErrors=false}={}){
 const parts=String(value).split(',').map(part=>part.trim());let mask=0;
 for(const character of parts[0]){
  const state=states[character.toUpperCase()];
  if(state){mask=hitdef?state:mask|state;continue}
  if(ignoreMostErrors&&character.charCodeAt(0)<128&&!/[a-z]/i.test(character))return mask;
  throw new Error('Invalid attr value: '+character);
 }
 for(const original of parts.slice(1)){
  const token=(ignoreMostErrors&&original.length>=2?original.slice(0,2).trim():original).toUpperCase();
  if(attacks[token]===undefined){if(ignoreMostErrors)return mask;throw new Error('Invalid attr value: '+original)}
  mask|=attacks[token];if(original.length>2)break;
 }
 return mask;
}

export function attackAttributeMatches(mask,attribute,{attackerState,projectile=false}={}){
 const compiledMask=compileAttackAttribute(mask),compiledHit=compileAttackAttribute(attribute,{hitdef:true});
 const state=projectile?compiledHit&63:states[String(attackerState).toUpperCase()]||0;
 return Boolean(compiledMask&state)&&Boolean(compiledMask&compiledHit&~63);
}