function randomValue(seed){const value=Math.sin(seed*12.9898+78.233)*43758.5453;return value-Math.floor(value)}
export function effectPulse(tick,index,kind='beam'){
 const rise=kind==='beam'?6:8,fade=kind==='beam'?36:16;
 let remaining=Math.max(0,tick)+index*(kind==='beam'?17:7),cycle=0;
 while(true){const hold=90+Math.floor(randomValue(index*37+cycle*101)*91),peak=kind==='beam'?0:60+Math.floor(randomValue(index*19+cycle*71)*31),duration=rise+peak+fade+hold;
  if(remaining<duration){if(remaining<rise)return remaining/rise;if(remaining<rise+peak)return 1;if(remaining<rise+peak+fade)return 1-(remaining-rise-peak)/fade;return 0}
  remaining-=duration;cycle++;
 }
}
export function particleLanding(phase,kind){const progress=Math.min(phase/.82,1),impact=Math.min(1,Math.max(0,(phase-.82)/.07));return {progress,landed:phase>=.82,coreScale:kind===1?1:1+impact*1.5,haloScale:2.4*(1+impact*2),fade:phase<=.9?1:Math.max(0,(1-phase)/.1)}}
