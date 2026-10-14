export function depthIntervalsOverlap(first,second,{enabled=false}={}){
 if(!enabled)return true;
 const interval=actor=>{const depth=actor.depth||[4,4],scale=actor.localScale??1,position=actor.z??0;return [Math.fround(Math.fround(position-depth[0])*scale),Math.fround(Math.fround(position+depth[1])*scale)]};
 const one=interval(first),two=interval(second);
 return one[1]>=two[0]&&one[0]<=two[1];
}
