export function downHitParameters(defender,params){
 if(defender.type!=='L')return null;
 const grounded=defender.y===0,source=grounded?(params['down.velocity']??params['air.velocity']):params['air.velocity'];
 const velocity=String(source??'0,0').split(',').map(value=>Math.fround(Number(value)));
 if(velocity[2])throw Error('Unsupported down velocity Z component');
 const time=Math.trunc(Number(params['down.hittime']??20))|0;
 return {velocity,hittime:time,ctrltime:time,state:grounded?5080:5020,
  suppressBounce:grounded&&(velocity[1]||0)!==0&&Number(params['down.bounce']??0)===0};
}
