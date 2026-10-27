const maximum=2147483647;

export function nativeRandomFloat(first,last,sample){
 const low=Math.fround(first),high=Math.fround(last),value=Math.fround(sample());
 return Math.fround(low+Math.fround(Math.fround(value*Math.fround(high-low))/Math.fround(maximum)));
}

export function nativeRandomInteger(first,last,sample){
 const low=Math.min(first|0,last|0),high=Math.max(first|0,last|0),value=sample();
 if(high-low>maximum)return Number(BigInt.asIntN(32,BigInt(low)+BigInt(value)*BigInt(high-low)/BigInt(maximum)));
 const width=(high-low+1)|0,divisor=(Math.trunc(maximum/width)+1)|0;
 return (low+Math.trunc(value/divisor))|0;
}

export function createNativeRandom(initialSeed=1){
 let seed=initialSeed|0;
 function next(){
  const quotient=Math.trunc(seed/127773);
  seed=(Math.imul((seed-Math.imul(quotient,127773))|0,16807)-Math.imul(quotient,2836))|0;
  if(seed<=0)seed=(seed+maximum-(seed===0?1:0))|0;
  return seed;
 }
 return {next,integer:(first,last)=>nativeRandomInteger(first,last,next),float:(first,last)=>nativeRandomFloat(first,last,next),state:()=>seed,seed:value=>{seed=value|0}};
}
