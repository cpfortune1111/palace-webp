export function reversalSparkGeometry(source,target,offset,targetOffset,{sourceScale=1,targetScale=1}={}){
 const sourceRatio=Math.fround(sourceScale),targetRatio=Math.fround(targetScale),horizontal=Math.fround(Math.fround(offset[0]??0)*sourceRatio),targetVertical=Math.fround(Math.fround(targetOffset[1]??0)*targetRatio),vertical=Math.fround(Math.fround(offset[1]??0)*sourceRatio);
 const x=Math.fround(source.x+Math.fround(horizontal*source.facing)),y=Math.fround(Math.fround(target.y+targetVertical)+vertical);
 return {x,y,sparkx:Math.fround(Math.fround((x-target.x)/targetRatio)*target.facing),sparky:Math.fround((y-target.y)/targetRatio)};
}
