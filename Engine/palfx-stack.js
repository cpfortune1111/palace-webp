export function stackPalFx(base,extra,mode,alpha=[0,0]){
 if(!extra)return base;
 if(!base)return extra;
 const result={...base,add:[...base.add],mul:[...base.mul]},baseInvert=base.rawInvertblend??base.invertblend,extraInvert=extra.rawInvertblend??extra.invertblend,baseNeg=base.rawInvertall??base.invertall,extraNeg=extra.rawInvertall??extra.invertall;
 const clamp=value=>Math.max(0,Math.min(255,value));
 for(let channel=0;channel<3;channel++){
  if(mode==='sub'){const absolute=extra.add[channel]<0?(-extra.add[channel])|0:extra.add[channel];result.add[channel]=clamp((result.add[channel]-absolute)|0);result.mul[channel]=clamp((result.mul[channel]-extra.add[channel])|0)}
  else result.add[channel]=(result.add[channel]+extra.add[channel])|0;
  result.mul[channel]=Math.trunc(Math.imul(result.mul[channel],extra.mul[channel])/256)|0;
 }
 result.hue=Math.fround(base.hue+extra.hue);result.color=Math.fround(base.color*extra.color);result.invertall=base.invertall!==extra.invertall;
 if(extraNeg){
  if(extraInvert===1){
   if((alpha[0]!==0||alpha[1]!==0)&&baseInvert>-3)result.invertall=baseNeg;
   if(baseInvert===0)result.invertblend=1;
   else if(baseInvert===1)result.invertblend=0;
   else if(baseInvert===-2){if(result.invertall){result.invertall=false;result.invertblend=-2}else result.invertblend=3}
   else if(baseInvert===2){result.invertall=baseNeg;result.invertblend=-1}
   else if(baseInvert===-1){result.invertall=baseNeg;result.invertblend=2}
  }
  if(baseInvert===-3){result.invertblend=result.invertall?3:-3;if(result.invertblend===-3)result.invertall=false}
 }
 return result;
}