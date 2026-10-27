export function fightFxAnimationProfile(resource,data,images){
 if(resource.prefix!=='f'||resource.collisionBoxes!=='none')throw Error('Unsupported FightFX resource contract');
 return {commonFx:true,fxScale:resource.scale,data,images,battle:{commonFx:true,coordinateSystem:{localcoord:resource.localcoord,webWorldWidth:1280},constants:{'size.xscale':1,'size.yscale':1},loopStarts:data.loopStarts,collision:Object.fromEntries(Object.entries(data.actions).map(([id,frames])=>[id,frames.map(()=>({c1:[],c2:[]}))]))}};
}
