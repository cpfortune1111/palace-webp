function randomValue(seed){const value=Math.sin(seed*12.9898+78.233)*43758.5453;return value-Math.floor(value)}
export function effectPulse(tick,index,kind='beam'){
 const rise=kind==='beam'?6:4,fade=kind==='beam'?36:8;
 let remaining=Math.max(0,tick)+index*(kind==='beam'?17:7),cycle=0;
 while(true){const hold=kind==='beam'?90+Math.floor(randomValue(index*37+cycle*101)*91):12+Math.floor(randomValue(index*19+cycle*71)*19),duration=rise+fade+hold;
  if(remaining<duration){if(remaining<rise)return remaining/rise;if(remaining<rise+fade)return 1-(remaining-rise)/fade;return 0}
  remaining-=duration;cycle++;
 }
}
export function particleLanding(phase,kind){const progress=Math.min(phase/.82,1),impact=Math.min(1,Math.max(0,(phase-.82)/.07));return {progress,landed:phase>=.82,coreScale:kind===1?1:1+impact*1.5,haloScale:2.4*(1+impact*2),fade:phase<=.9?1:Math.max(0,(1-phase)/.1)}}
