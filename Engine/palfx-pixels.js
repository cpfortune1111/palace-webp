function shiftedHue(color,shift){
 const maximum=Math.max(...color),minimum=Math.min(...color),difference=maximum-minimum;
 let hue=0;
 if(difference){if(maximum===color[0])hue=(color[1]-color[2])/difference;else if(maximum===color[1])hue=2+(color[2]-color[0])/difference;else hue=4+(color[0]-color[1])/difference;hue/=6}
 hue=((hue+shift)%1+1)%1;
 const saturation=difference/(maximum+1e-10),sector=hue*6,index=Math.floor(sector),fraction=sector-index;
 const low=maximum*(1-saturation),falling=maximum*(1-fraction*saturation),rising=maximum*(1-(1-fraction)*saturation);
 return [[maximum,rising,low],[falling,maximum,low],[low,maximum,rising],[low,falling,maximum],[rising,low,maximum],[maximum,low,falling]][index%6];
}

export function palFxPixels(source,effect,{mode='none',isRgba=true,forceGray=false}={}){
 if(source.length%4)throw Error('PalFX source must contain RGBA pixels');
 const result=new Float32Array(source.length),negativeMultipliers=mode==='sub'&&effect.allowNegative;
 const adds=forceGray?Array(3).fill(effect.add.reduce((sum,value)=>sum+value,0)/3):effect.add;
 const multipliers=forceGray?Array(3).fill(effect.mul.reduce((sum,value)=>sum+value,0)/3):effect.mul;
 for(let offset=0;offset<source.length;offset+=4){
  const alpha=source[offset+3]/255;let color=[source[offset]/255,source[offset+1]/255,source[offset+2]/255];
  if(effect.hue)color=shiftedHue(color,effect.hue);
  if(effect.invertall)color=color.map(value=>(isRgba?alpha:1)-value);
  const gray=color.reduce((sum,value)=>sum+value,0)/3;
  for(let channel=0;channel<3;channel++){
   const colored=forceGray?gray:gray+(color[channel]-gray)*effect.color;
   const multiplier=negativeMultipliers?(multipliers[(channel+1)%3]+multipliers[(channel+2)%3])/512:multipliers[channel]/256;
   result[offset+channel]=(colored+adds[channel]/255*(isRgba?alpha:1))*multiplier*255;
  }
  result[offset+3]=source[offset+3];
 }
 return result;
}