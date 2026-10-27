export function spriteOwnerScale(selfLocalCoord,spriteLocalCoord,{sameOwner=false}={}){
 if(sameOwner)return 1;
 return Math.fround(Math.fround(selfLocalCoord)/Math.fround(spriteLocalCoord));
}
export function commonFightFxScale(selfLocalCoord,fxLocalCoord,fxScale){
 let scale=Math.fround(fxScale);
 if(fxLocalCoord>0)scale=Math.fround(Math.fround(scale*320)/Math.fround(fxLocalCoord));
 return Math.fround(scale*Math.fround(Math.fround(selfLocalCoord)/320));
}
export function applySpriteOwnerScale(context,scale,x,y){
 if(scale===1)return;
 context.translate(x,y);context.scale(scale,scale);context.translate(-x,-y);
}
