function reaction(value,fallback){
 if(value===undefined)return fallback;
 const name=String(value).trim().toLowerCase(),types={l:0,m:1,h:2,b:3,u:4,d:5};
 if(types[name[0]]===undefined)throw Error('Invalid CNS animtype '+value);
 return types[name[0]];
}

function hitType(value,fallback){
 if(value===undefined)return fallback;
 const name=String(value).trim().toLowerCase(),types={n:0,h:1,l:2,t:3};
 if(types[name[0]]===undefined)throw Error('Invalid CNS hit type '+value);
 return types[name[0]];
}

export function hitReactionMetadata(params,aerial=false){
 const ground=reaction(params.animtype,0),air=reaction(params['air.animtype'],ground),fall=reaction(params['fall.animtype'],air>=4?air:3),groundType=hitType(params['ground.type'],1),airType=hitType(params['air.type'],groundType);
 return {'ground.animtype':ground,'air.animtype':air,'fall.animtype':fall,groundtype:groundType,airtype:airType,type:aerial?airType:groundType};
}

export function activeHitReaction(hit,aerial=false){
 if(hit.fall)return hit['fall.animtype'];
 if(aerial)return hit['air.animtype'];
 return hit['ground.animtype']>=3&&hit.yvel===0?2:hit['ground.animtype'];
}
