export function spriteOwnerScale(selfLocalCoord,spriteLocalCoord,{sameOwner=false}={}){
 if(sameOwner)return 1;
 return Math.fround(Math.fround(selfLocalCoord)/Math.fround(spriteLocalCoord));
}
export function applySpriteOwnerScale(context,scale,x,y){
 if(scale===1)return;
 context.translate(x,y);context.scale(scale,scale);context.translate(-x,-y);
}
