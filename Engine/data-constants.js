export const dataConstantNames=new Set([
 'data.life','data.power','data.dizzypoints','data.guardpoints','data.attack','data.defence',
 'data.fall.defence_up','data.fall.defence_mul','data.liedown.time','data.airjuggle',
 'data.sparkno','data.guard.sparkno','data.hitsound.channel','data.guardsound.channel',
 'data.ko.echo','data.volume','data.intpersistindex','data.floatpersistindex'
]);

export function dataConstant(name,values){
 const key=String(name).toLowerCase();
 if(!dataConstantNames.has(key)||!values||!Object.hasOwn(values,key))return {handled:false};
 return {handled:true,value:key==='data.fall.defence_mul'?Math.fround(Number(values[key])):Math.trunc(Number(values[key]))|0};
}
