import {controllerStringLiteral} from './controller-string-literal.js';
import {controllerBoolean,controllerFloat32} from './controller-value-conversion.js';
export function applyModifyPlayerController(controller,caller,api){
 if(String(controller.type).toLowerCase()!=='modifyplayer')return false;
 const params=controller.params||{};
 const integer=expression=>{const value=api.evaluate(expression);return typeof value==='string'||value===undefined||Number.isNaN(Number(value))?0:Math.trunc(Number(value))|0};
 for(const name of Object.keys(params))if(!['redirectid','unhittabletime','hitpausetime','lifemax','powermax','dizzypointsmax','guardpointsmax','helpervar.id','movehit','moveguarded','movereversed','movecountered','attack','defence','pausemovetime','supermovetime','ailevel','helpername','displayname','lifebarname','alive','teamside'].includes(name))throw Error('Unsupported ModifyPlayer parameter '+name);
 const names={};for(const name of ['displayname','lifebarname','helpername'])if(params[name]!==undefined)names[name]=controllerStringLiteral(params[name],name);
 const target=params.redirectid===undefined?caller:api.findActor(integer(params.redirectid));
 if(!target)return true;
 for(const [name,maximum,current,minimum] of [['lifemax','lifeMax','life',1],['powermax','powerMax','power',0],['dizzypointsmax','dizzyPointsMax','dizzyPoints',0],['guardpointsmax','guardPointsMax','guardPoints',0]])if(params[name]!==undefined){const actor=api.maximumActor(target,name),value=Math.max(minimum,integer(params[name]));actor[maximum]=value;actor[current]=Math.max(0,Math.min(actor[current],value))}
 if(params.teamside!==undefined){const side=integer(params.teamside);if(side>=0&&side<=2)api.setTeamSide(target,side)}
 for(const name of ['displayname','lifebarname'])if(names[name]!==undefined)api.setName(target,name,names[name]);
 if(names.helpername!==undefined&&target.kind==='helper')target.name=names.helpername;
 if(params['helpervar.id']!==undefined&&target.kind==='helper')target.id=Math.max(0,integer(params['helpervar.id']));
 for(const [name,type] of [['movehit','hit'],['moveguarded','guarded'],['movereversed','reversed']])if(params[name]!==undefined)api.setMoveContact(target,type,Math.max(0,integer(params[name])));
 if(params.movecountered!==undefined)api.setMoveCountered(target,controllerBoolean(api.evaluate(params.movecountered)));
 if(params.hitpausetime!==undefined)api.setHitPauseTime(target,Math.max(0,integer(params.hitpausetime)));
 for(const [name,slot] of [['pausemovetime','normal'],['supermovetime','super']])if(params[name]!==undefined)api.setPauseMoveTime(target,slot,Math.max(0,integer(params[name])));
 if(params.unhittabletime!==undefined)api.setUnhittableTime(target,Math.max(0,integer(params.unhittabletime)));
 for(const name of ['attack','defence'])if(params[name]!==undefined)api.setBase(target,name,integer(params[name]));
 if(params.alive!==undefined)api.setAlive(target,controllerBoolean(api.evaluate(params.alive)));
 if(params.ailevel!==undefined)api.setAILevel(target,controllerFloat32(api.evaluate(params.ailevel)));
 return true;
}
