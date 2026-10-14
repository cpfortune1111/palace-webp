export function hitContactMetadata(params,kill){
 return {priority:Math.trunc(Number(String(params.priority??'4, Hit').split(',')[0]))|0,facing:Math.trunc(Number(params.p2facing??0))|0,kill:Number(!!kill)};
}
