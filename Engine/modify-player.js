export function applyModifyPlayerController(controller,caller,api){
 if(String(controller.type).toLowerCase()!=='modifyplayer')return false;
 const params=controller.params||{};
 for(const name of Object.keys(params))if(!['redirectid','unhittabletime','hitpausetime','lifemax','powermax','dizzypointsmax','guardpointsmax','helpervar.id','movehit','moveguarded','movereversed','movecountered','attack','defence','pausemovetime','supermovetime'].includes(name))throw Error('Unsupported ModifyPlayer parameter '+name);
 const target=params.redirectid===undefined?caller:api.findActor(Math.trunc(Number(api.evaluate(params.redirectid)))|0);
 if(!target)return true;
 for(const [name,maximum,current,minimum] of [['lifemax','lifeMax','life',1],['powermax','powerMax','power',0],['dizzypointsmax','dizzyPointsMax','dizzyPoints',0],['guardpointsmax','guardPointsMax','guardPoints',0]])if(params[name]!==undefined){const actor=api.maximumActor(target,name),value=Math.max(minimum,Math.trunc(Number(api.evaluate(params[name])))|0);actor[maximum]=value;actor[current]=Math.max(0,Math.min(actor[current],value))}
 if(params['helpervar.id']!==undefined&&target.kind==='helper')target.id=Math.max(0,Math.trunc(Number(api.evaluate(params['helpervar.id'])))|0);
 for(const [name,type] of [['movehit','hit'],['moveguarded','guarded'],['movereversed','reversed']])if(params[name]!==undefined)api.setMoveContact(target,type,Math.max(0,Math.trunc(Number(api.evaluate(params[name])))|0));
 if(params.movecountered!==undefined)api.setMoveCountered(target,Number(api.evaluate(params.movecountered))!==0);
 if(params.hitpausetime!==undefined)api.setHitPauseTime(target,Math.max(0,Math.trunc(Number(api.evaluate(params.hitpausetime)))|0));
 for(const [name,slot] of [['pausemovetime','normal'],['supermovetime','super']])if(params[name]!==undefined)api.setPauseMoveTime(target,slot,Math.max(0,Math.trunc(Number(api.evaluate(params[name])))|0));
 if(params.unhittabletime!==undefined)api.setUnhittableTime(target,Math.max(0,Math.trunc(Number(api.evaluate(params.unhittabletime)))|0));
 for(const name of ['attack','defence'])if(params[name]!==undefined)api.setBase(target,name,Math.trunc(Number(api.evaluate(params[name])))|0);
 return true;
}
