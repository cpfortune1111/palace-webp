import {movementHitFriction} from '../../Engine/hit-friction.js?v=02505';
import {hitDefCornerPush} from '../../Engine/hitdef-cornerpush.js';
import {compileHitStateParameters} from '../../Engine/hit-state-parameters.js';
import {prepareReversalDefinition} from '../../Engine/reversal-definition.js';
import {helperKeyControl,helperCommandAllowed,helperNegativeStates} from '../../Engine/helper-key-control.js';
import {hitPauseVersionProfile} from '../../Engine/hit-pause-version.js';
import {stepZPhysics} from '../../Engine/z-physics.js?v=02505';
import {createDepthBoundFlags} from '../../Engine/depth-bound.js?v=02505';
import {createDepthModifiers} from '../../Engine/depth-controller.js?v=02505';
import {cancelProjectilePair,sortedProjectileCandidates,projectileTeamCanTrade} from '../../Engine/projectile-cancellation.js?v=02505';
import {createPlayerPushState} from '../../Engine/player-push.js?v=02475';
import {createScreenBoundFlags} from '../../Engine/screen-bound.js?v=02474';
import {createWidthModifiers} from '../../Engine/width-controller.js?v=02473';
import {helperTypeParameter} from '../../Engine/target-power.js?v=02465';
import {hitDefVelocityDefaults} from '../../Engine/hitdef-velocity-defaults.js?v=02505';
import {compileHitPriority} from '../../Engine/hit-priority.js?v=02505';
import {hitPowerParameters} from '../../Engine/hit-power-parameters.js';
import {hitAttackDepth} from '../../Engine/hit-attack-depth.js';
import {compileHitChain} from '../../Engine/hit-chain.js';
import {compileHitAffectTeam} from '../../Engine/hit-team.js';
import {compileAttackAttribute} from '../../Engine/attack-attribute.js';
import {hitUnhittableTime} from '../../Engine/hit-unhittable-time.js';
import {hitPauseParameters} from '../../Engine/hit-pause-parameters.js';
import {reversalFallDefinition} from '../../Engine/reversal-fall-definition.js';
import {prepareHitPosition} from '../../Engine/hit-position.js';
import {consumeHitOnceContact} from '../../Engine/hit-once.js';
import {hitDefCount} from '../../Engine/hit-count.js';
import {createAttackState} from '../../Engine/attack-controllers.js';
import {createHitBySlots,tickHitBySlots} from '../../Engine/hit-by.js?v=02485';
import {createHitOverrides,selectHitOverride,tickHitOverrides} from '../../Engine/hit-override.js?v=02485';
import {excludesHit,allowsHit} from '../../Engine/hit-attribute-mask.js?v=02485';
import {createAngleState,resetAngleDraw} from '../../Engine/angle-controllers.js';
import {createControllerSchedule} from '../../Engine/controller-schedule.js';
export function createSpecialRuntime(api){
 const entities=[],pauses={normal:[null,null],super:[null,null]},unhittableUntil={1:0,2:0},stagePauseFlags={normal:true,super:true};let serial=0;
 const projectileContacts=new Map(),moveTimes=new Map();
 const moveTimeKey=actor=>actor.kind==='helper'?actor.key:'root'+(actor.player??actor.id);
 const root=player=>api.root(player);
 const blocked=(player,entity=null)=>{
  const slot=pauses.super.some(pause=>pause?.remaining>0)?'super':'normal',active=pauses[slot].filter(pause=>pause?.remaining>0&&pause.created!==api.tick());
  if(!active.length)return false;
  const modified=moveTimes.get(entity?entity.key:'root'+player)?.[slot];if(modified!==undefined)return modified<=0;
  if(entity){const allowance=Number(entity[slot==='super'?'supermovetime':'pausemovetime']||0),start=Math.max(Math.min(...active.map(pause=>pause.created)),entity.created??-Infinity);return api.tick()-start>allowance}
  if(!pauses[slot][player-1]?.movetime&&api.trigger){const fighter=root(player),data=api.data(player),definition=data.states?.[String(fighter.state)]||data.attackStates?.[String(fighter.state)]||data.locomotionStates?.[String(fighter.state)];if(fighter.time===0){const pending=definition?.controllers.find(controller=>controller.type===(slot==='super'?'SuperPause':'Pause')&&Number(controller.params.movetime)>0&&api.trigger(controller,context(fighter)));if(pending){const remaining=Number(pending.params.time);pauses[slot][player-1]={kind:slot,remaining,movetime:Math.min(remaining,Number(pending.params.movetime)),player,created:api.tick()}}}}
  return !(pauses[slot][player-1]?.movetime>0);
 };
 const numeric=(params,context,player=context?.player??1)=>{
  const result={...params,...compileHitChain(params,{evaluate:value=>api.eval(value,context),split:api.pair}),...compileHitStateParameters(params,{evaluate:value=>api.eval(value,context)})};
  if(params.attr!==undefined||params['reversal.attr']!==undefined){result.hitDefinitionStateOwner=context?.stateOwner??api.data(player).character;result.hitDefinitionForeignStateOwner=!!context?.foreignStateOwner;}
  if(params.attr!==undefined||params['reversal.attr']!==undefined||params.pausetime!==undefined||params['guard.pausetime']!==undefined){const pause=hitPauseParameters(params,{evaluate:value=>api.eval(value,context),split:api.pair});result.pausetime=pause.pause.join(',');result['guard.pausetime']=pause.guard.join(',')}
  if(params.attr!==undefined||params['reversal.attr']!==undefined||params.unhittabletime!==undefined)result.unhittabletime=hitUnhittableTime(params,{pause:String(result.pausetime??'0,0').split(',').map(Number),reversal:params['reversal.attr']!==undefined&&compileAttackAttribute(params['reversal.attr'])!==0,throwAttribute:params.attr!==undefined&&(compileAttackAttribute(params.attr,{hitdef:true})&9344)!==0,evaluate:value=>api.eval(value,context),split:api.pair}).join(',');
  if(params.attr!==undefined||params['reversal.attr']!==undefined){compileHitAffectTeam(params.affectteam);const nativeTeam=context?.teamSide??root(player).teamSide??player,side=params.teamside===undefined?nativeTeam:Math.trunc(Number(api.eval(params.teamside,context)))|0;result.hitDefinitionTeamSide=side>=0&&side<=2?side:nativeTeam}
  if(params['attack.depth']!==undefined)result['attack.depth']=hitAttackDepth(params,{evaluate:value=>api.eval(value,context),split:api.pair}).join(',');
  if(params.attr!==undefined||params['reversal.attr']!==undefined){const velocities=hitDefVelocityDefaults(params,{evaluate:value=>api.eval(value,context),split:api.pair});for(const [name,key] of [['ground.velocity','ground'],['air.velocity','air'],['guard.velocity','guard'],['airguard.velocity','airguard'],['down.velocity','down']])result[name]=velocities[key].join(',');const data=api.data(player);Object.assign(result,hitDefCornerPush(params,{velocities,ikemen:hitPauseVersionProfile(data).ikemen,legacyDefault:data.constants?.['legacy.cornerpushdefaults'],evaluate:value=>api.eval(value,context)}))}
  if(['snap','mindist','maxdist'].some(key=>params[key]!==undefined))result.hitPosition=prepareHitPosition(params,{splitPair:api.pair,evaluate:value=>api.eval(value,context)});
  for(const key of ['damage','sparkxy','ground.velocity','guard.velocity','air.velocity','airguard.velocity','down.velocity','offset','velocity'])if(params[key]!==undefined&&!((params.attr!==undefined||params['reversal.attr']!==undefined)&&['ground.velocity','guard.velocity','air.velocity','airguard.velocity','down.velocity'].includes(key))&&!/^\s*[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?\s*(?:,\s*[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?\s*)*$/.test(params[key]))result[key]=api.pair(params[key]).map(value=>api.eval(value,context)).join(',');
  if(params.attr!==undefined||params['reversal.attr']!==undefined){const power=hitPowerParameters({...params,damage:result.damage},{constants:api.data(player).constants||{},evaluate:value=>api.eval(value,context),split:api.pair});result.getpower=[power.hitGetPower,power.guardGetPower].join(',');result.givepower=[power.hitGivePower,power.guardGivePower].join(',')}
  if(params.score!==undefined){const components=api.pair(params.score);if(components.length>2)throw Error('Invalid score component count');result.score=components.map(value=>Math.fround(Number(api.eval(value,context)))).join(',')}
  if(params.priority!==undefined)result.priority=compileHitPriority(params.priority,{evaluate:value=>api.eval(value,context)});
  for(const key of ['hitredlife','guardredlife','dizzypoints','guardpoints','airguard.ctrltime','numhits','fall.envshake.time','fall.envshake.ampl','down.hittime','fall.recovertime','p1facing','p1getp2facing','p2facing','p1sprpriority','p2sprpriority','missonoverride'])if(params[key]!==undefined)result[key]=Math.trunc(Number(api.eval(params[key],context)))|0;
  for(const key of ['xaccel','yaccel','zaccel','stand.friction','crouch.friction','fall.envshake.freq','fall.envshake.phase','fall.envshake.mul','fall.envshake.dir','fall.envshake.diradd','fall.envshake.decay'])if(params[key]!==undefined)result[key]=Math.fround(Number(api.eval(params[key],context)));
  for(const key of ['ignorereversaldef','keepstate','kill','guard.kill','fall.kill','hitonce','forcestand','forcecrouch','down.bounce','fall.recover'])if(params[key]!==undefined)result[key]=Number(api.eval(params[key],context))!==0?1:0;
  for(const key of ['projanim','projhitanim','projremanim','projcancelanim','projhits','projmisstime','projremovetime'])if(params[key]!==undefined)result[key]=api.eval(params[key],context);
  if(params['reversal.attr']!==undefined)result.reversalFallData={...reversalFallDefinition(result,{evaluate:value=>api.eval(value,context),resetOptions:api.hitDefinitionResetOptions?.(player)}),unhittabletime:result.unhittabletime,hitDefinitionTeamSide:result.hitDefinitionTeamSide};
  return result;
 };
 function context(entity,commands){
  if(commands===undefined)commands=entity.kind==='helper'?(api.helperCommands?.(entity)||{}):api.commands(entity.player);
  if(!helperCommandAllowed(entity))commands={};
  const base=api.context(entity,root(entity.player===1?2:1),commands);
  return {...base,rootVar:index=>root(entity.player).vars[index]||0,numProj:id=>entities.filter(item=>item.player===entity.player&&item.kind==='projectile'&&item.id===id&&!item.destroyed).length,
   numExplod:id=>api.effects.filter(effect=>effect.ownerKey===entity.key&&effect.id===id).length,
   query:name=>name.toLowerCase()==='hitcount'?entity.hitCount||0:name.toLowerCase()==='guardcount'?entity.guardCount||0:base.query(name)};
 }
 function helperDefinition(entity,state){const data=api.data(entity.player);return data.helperStates[String(state)]||data.lifecycleHelpers?.[String(state)]||data.states?.[String(state)]}
 function enter(entity,state){
  const definition=helperDefinition(entity,state);if(!definition)throw Error('Unknown helper state '+state);
  api.transitionMoveContact?.(entity,definition);
  if(!Number(definition.hitcountpersist??0)){entity.hitCount=0;entity.guardCount=0}
  if(!definition.hitdefpersist)entity.guardHitDef=null;
  Object.assign(entity,{state,time:0,type:definition.type??entity.type,physics:definition.physics??entity.physics,moveType:definition.moveType??entity.moveType,ctrl:definition.ctrl??entity.ctrl,animStartTime:0,once:new Set(),moveContact:0,moveHit:0,moveGuarded:0,activeHitDef:null});
  entity.controllerSchedule=createControllerSchedule();
  entity.sprPriority=definition.sprpriority??entity.sprPriority;
  if(definition.velset){entity.vx=definition.velset[0]*entity.facing;entity.vy=definition.velset[1]}
  if(definition.anim!==undefined){entity.anim=definition.anim;entity.elem=1;entity.elemTick=0}
 }
 function spawn(params,owner,player,kind){
  const sourceContext=context({...owner,player,key:owner.key||'root'+player});
  const values=numeric(params,sourceContext),offset=String(values.offset||values.pos||'0,0').split(',').map(Number),velocity=String(values.velocity||'0,0').split(',').map(Number);
  const entity={kind,teamSide:owner.teamSide??player,parentKey:owner.kind==='helper'?owner.key:null,key:'entity'+(++serial),player,abilityState:owner.abilityState??owner.state,id:Number(params.projid??params.id),x:owner.x+(offset[0]||0)*owner.facing,y:owner.y+(offset[1]||0),facing:owner.facing,
   vx:(velocity[0]||0)*owner.facing,vy:velocity[1]||0,time:0,anim:Number(params.projanim),animStartTime:0,elem:1,elemTick:0,type:'A',moveType:'A',ctrl:0,vars:Array(60).fill(0),sysvars:Array(10).fill(0),
   life:1000,power:0,powerMax:owner.powerMax??api.data(player).powerMaximum,attackState:kind==='projectile'?{...(owner.attackState||createAttackState())}:createAttackState(),angleState:createAngleState(),maps:new Map(owner.mapDefaults||[]),mapDefaults:new Map(owner.mapDefaults||[]),fvars:Array(40).fill(0),hitCount:0,guardCount:0,hitPause:0,moveContact:0,moveHit:0,moveGuarded:0,sprPriority:Number(params.projsprpriority??-1),supermovetime:Number(params.supermovetime||0),pausemovetime:Number(params.pausemovetime||0),once:new Set(),created:api.tick(),params:values};
  entity.instanceId=1000+serial;if(kind==='projectile'){entity.projectileOwnerId=owner.kind==='helper'?owner.instanceId:owner.player??player;entity.projectileId=entity.id}
  if(kind==='projectile'&&api.projectileCollisionSettings){const collision=api.projectileCollisionSettings(owner,params,sourceContext);entity.collisionSettings=collision.settings;entity.collisionWorldScale=collision.worldScale;entity.attackDepth=collision.attackDepth;entity.z=Number(owner.z||0)}
  if(kind==='helper'){entity.keyControl=helperKeyControl(params.keyctrl,{split:api.pair,evaluate:expression=>api.eval(expression,sourceContext)});entity.hitOverrides=createHitOverrides();entity.helperType=helperTypeParameter(params.helpertype);entity.ownsPalette=Number(api.eval(params.ownpal??0,sourceContext))!==0;entity.paletteParentKey=owner.kind==='helper'?owner.key:'root'+player;api.initializePalette?.(entity,owner)}
  if(kind==='helper'&&params.extendsmap!==undefined&&api.eval(params.extendsmap,sourceContext))for(const [name,value] of owner.maps||[])entity.maps.set(name,value);
  if(kind==='projectile'){entity.anim=Number(values.projanim);entity.scale=String(params.projscale||'1,1').split(',').map(Number);entity.activeHitDef=values.attr?{hitKey:entity.key,guardDistance:api.projectileGuardHitDef?.(player,params,sourceContext),params:values}:null;entity.removetime=Number(values.projremovetime??-1);entity.priority=Math.trunc(Number(api.eval(params.projpriority??1,sourceContext)))|0;entity.priorityPoints=entity.priority;entity.remainingHits=Math.trunc(Number(values.projhits??1))|0}
  else enter(entity,Number(params.stateno));
  if(api.data(player).character==='SailorMoon'&&[3050,3051].includes(entity.state))entity.y=0;
  entities.push(entity);return entity;
 }
 function startPause(params,player,kind,sourceContext,owner){
  const remaining=Number(params.time),movetime=Math.max(0,Math.min(remaining,Number(params.movetime||0))),slot=kind==='super'?'super':'normal';
  const modified=moveTimes.get(moveTimeKey(owner||root(player)));if(modified)delete modified[slot];
  stagePauseFlags[slot]=params.pausebg===undefined||Number(api.eval(params.pausebg,sourceContext))!==0;pauses[slot][player-1]=remaining>0?{kind,remaining,movetime,player,created:api.tick()}:null;
  if(kind==='super'){if(params.sound){if(/^S/i.test(params.sound))api.sound(params.sound,player===1?0:4,player);else {const sound=String(params.sound).split(',').map(Number);api.commonSound(sound[0],sound[1],player===1?0:4)}}if(Number(params.unhittable??1))unhittableUntil[player]=api.tick()+remaining+1}
 }
 function dispatch(controller,binding,sourceContext,adapter,owner,player){
  const params=controller.params;
  switch(controller.type){
   case 'Projectile':spawn(params,owner,player,'projectile');return true;
   case 'Helper':if(Number(params.stateno)!==950)spawn(params,owner,player,'helper');return true;
   case 'Pause':startPause(params,player,'normal',sourceContext||context(owner||root(player)),owner);return true;
   case 'SuperPause':startPause(params,player,'super',sourceContext||context(owner||root(player)),owner);return true;
   case 'RemoveExplod':for(let index=api.effects.length-1;index>=0;index--)if(api.effects[index].ownerKey===(owner.key||'root'+player)&&(params.id===undefined||api.effects[index].id===Number(params.id)))api.effects.splice(index,1);return true;
   case 'StopSnd':api.stopSound(Number(params.channel||0)+(player===2?4:0));return true;
   default:return false;
  }
 }
 function helperController(entity,controller,index,global=false){
  const canonical={varset:'VarSet',varadd:'VarAdd',parentvarset:'ParentVarSet',parentvaradd:'ParentVarAdd',rootvarset:'RootVarSet',rootvaradd:'RootVarAdd',bindtoroot:'BindtoRoot'};
  controller={...controller,type:canonical[controller.type.toLowerCase()]||controller.type};
  const ctx=context(entity);
  if(global?(entity.hitPause>0&&!Number(controller.params.ignorehitpause??0)):!entity.controllerSchedule.before(index,controller.params,{hitPause:entity.hitPause>0}))return;
  if(!api.trigger(controller,ctx))return;
  if(!global){entity.controllerSchedule.executed(index,controller.params);entity.once.add(index)}const params=controller.params;
  if(dispatch(controller,entity,ctx,{},entity,entity.player))return;
  switch(controller.type){
   case 'HitDef':entity.activeHitDef={hitKey:entity.key+':'+(++serial),guardDistance:api.guardHitDef?.(entity.player,entity,params,ctx),params:numeric(params,ctx)};entity.hitSpent=false;api.activateHitDef?.(entity);break;
   case 'ReversalDef':{const definition=prepareReversalDefinition(params);entity.activeHitDef={reversal:true,hitKey:entity.key+':'+(++serial),guardDistance:api.guardHitDef?.(entity.player,entity,definition,ctx),params:numeric(definition,ctx)};entity.hitSpent=false;api.activateHitDef?.(entity);break;}
   case 'Explod':api.explod(params,entity,entity.player,ctx);break;
   case 'HitOverride':api.controller(controller,entity,ctx,{owner:entity,player:entity.player,schedulingApplied:true});break;
   case 'HitBy':case 'NotHitBy':api.controller(controller,entity,ctx,{owner:entity,player:entity.player,schedulingApplied:true});break;
   case 'AssertSpecial':if(api.damageAssertion?.(controller,entity,ctx))break;if(String(params.flag).toLowerCase()==='invisible')entity.invisible=true;else if(String(params.flag).toLowerCase()!=='noshadow')throw Error('Unsupported helper assertion');break;
   case 'DestroySelf':entity.destroyed=true;break;
   default:{const binding=Object.create(entity);Object.defineProperties(binding,{vx:{get:()=>entity.vx*entity.facing,set:value=>{entity.vx=value*entity.facing}},vy:{get:()=>entity.vy,set:value=>{entity.vy=value}},anim:{get:()=>entity.anim,set:value=>{entity.anim=value;entity.animStartTime=entity.time}},elem:{get:()=>entity.elem,set:value=>{entity.elem=value}},elemTick:{get:()=>entity.elemTick,set:value=>{entity.elemTick=value}}});for(const key of ['x','y','facing','sprPriority','ctrl','type','physics','moveType'])Object.defineProperty(binding,key,{get:()=>entity[key],set:value=>{entity[key]=value}});api.controller(controller,binding,ctx,{player:entity.player,owner:entity,schedulingApplied:global,changeState:state=>enter(entity,state),playSound:(value,channel)=>api.sound(value,channel<0?channel:channel+(entity.player===2?4:0),entity.player),explod:params=>api.explod(params,entity,entity.player,ctx)});}
  }
 }
 function helperGlobalState(entity,stateNo){
  const data=api.data(entity.player);
  const controllers=stateNo===-1?(data.playerCommands??data.globalControllers?.['-1']??[]):data.globalControllers?.[String(stateNo)]??[];
  for(const [index,controller]of controllers.entries()){
   helperController(entity,{...controller,controllerStateNo:stateNo,controllerSchedulingKey:controller},index,true);
   if(entity.destroyed)return;
  }
 }
 function helperGlobals(entity){
  for(const stateNo of [-3,-2,-1]){
   if(!helperNegativeStates(entity).includes(stateNo))continue;
   helperGlobalState(entity,stateNo);if(entity.destroyed)return;
  }
 }
 function hit(entity){
  const defender=root(entity.player===1?2:1);
  if(entity.kind==='projectile'&&entity.remainingHits<=0)return;
  if(entity.moveType!=='A'||entity.hitSpent||api.tick()<(entity.nextHitTick||0)||!entity.activeHitDef||entity.activeHitDef.hitOnceSpent||!api.collision({...entity,hitDef:entity.activeHitDef},defender).contact)return;
  if(entity.activeHitDef.params.nochainid!==undefined&&Number(entity.activeHitDef.params.nochainid)===Number(defender.getHit?.hitid))return;
  const contactParams=entity.activeHitDef.params,result=api.hit(entity,defender,contactParams);
  if(!result)return;
  consumeHitOnceContact(entity.activeHitDef,{accepted:true,isProjectile:entity.kind==='projectile'});
  entity.hitSpent=true;entity.hitTarget=result.guarded?null:defender.player;
  entity.moveContact=1;entity.moveHit=result.guarded?0:1;entity.moveGuarded=result.guarded?1:0;entity.hitCount=(entity.hitCount+(result.guarded?0:hitDefCount(entity.activeHitDef?.params||entity.params||{})))|0;entity.guardCount=((entity.guardCount||0)+(result.guarded?hitDefCount(entity.activeHitDef?.params||entity.params||{}):0))|0;
  entity.hitPause=result.attackerPause;
  api.sourceHitState?.(entity,contactParams,result);
  if(entity.kind==='projectile'){
   projectileContacts.set(entity.player+':'+entity.id,{tick:api.tick(),guarded:result.guarded});
   entity.remainingHits=(entity.remainingHits??Math.max(1,Number(entity.params.projhits)||1))-1;
   if(entity.remainingHits>0){entity.hitSpent=false;entity.nextHitTick=api.tick()+Math.max(1,Number(entity.params.projmisstime)||0);entity.activeHitDef={...entity.activeHitDef,hitKey:entity.key+':'+(++serial)};return;}
   entity.activeHitDef=null;entity.removing=true;entity.anim=Number(entity.params.projhitanim??-1);entity.time=0;entity.animStartTime=0;entity.elem=1;entity.elemTick=0;entity.vx=0;entity.vy=0;
   if(entity.anim<0)entity.destroyed=true;
  }
 }
 function removeProjectile(entity,reason){
  entity.removing=true;entity.activeHitDef=null;entity.vx=0;entity.vy=0;
  const selected=entity.params[reason==='cancel'?'projcancelanim':'projremanim']??entity.params.projhitanim??-1;
  if(selected!==undefined){entity.anim=Number(selected);entity.time=0;entity.elem=1;entity.elemTick=0}
  else entity.time=api.frames(entity.anim,entity.player).slice(0,entity.elem-1).reduce((total,frame)=>total+Math.max(1,Number(frame.time)||1),0)+entity.elemTick;
  entity.animStartTime=0;if(entity.anim<0||api.duration(entity.anim,entity.player)<=0)entity.destroyed=true;
 }
 function step(){
  for(const entity of [...entities]){
   if(entity.destroyed||entity.kind==='helper'&&entity.disabled)continue;
   if(blocked(entity.player,entity)){if(entity.kind==='helper')helperGlobalState(entity,-4);continue}
   if(entity.kind==='helper'&&(api.data(entity.player).compatibility==='mugen'||!(entity.hitPause>0)))tickHitOverrides(entity.hitOverrides??=createHitOverrides());resetAngleDraw(entity.angleState);if(entity.kind==='helper'){entity.drawOffset=[0,0];entity.transState=null}
   if(entity.kind==='helper')for(const slot of [...(entity.clsnOverrides||[]),...(entity.clsnTransforms||[])])slot.length=0;
   entity.assertions?.clear();
   if(entity.kind==='helper'&&!(entity.hitPause>0))tickHitBySlots(entity.hitBySlots??=createHitBySlots());
   if(entity.hitPause>0){
    if(entity.kind==='helper'){
     helperGlobalState(entity,-4);if(entity.destroyed)continue;
     helperGlobals(entity);if(entity.destroyed)continue;
     const previous=entity.state,controllers=helperDefinition(entity,previous).controllers;
     for(let index=0;index<controllers.length;index++){helperController(entity,controllers[index],index);if(entity.destroyed||entity.state!==previous)break}
    }
    api.finishHitFrame?.(entity);entity.hitPause--;continue;
   }
   if(entity.kind==='helper'){entity.depthBoundFlags=createDepthBoundFlags(entity.helperType===2);entity.depthModifiers=createDepthModifiers();entity.heightModifiers=[0,0];entity.widthModifiers=createWidthModifiers();entity.screenBoundFlags=createScreenBoundFlags(entity.helperType===2);entity.playerPushState=createPlayerPushState(entity.helperType===2&&(api.roundState?.()??2)>0&&(api.roundState?.()??2)<4)}
   if(entity.kind==='helper'){helperGlobalState(entity,-4);if(entity.destroyed)continue}
   if(entity.created===api.tick())continue;
   if(entity.kind==='helper'){
    entity.positionFrozen=false;entity.randomValue=Math.floor(Math.random()*1000);
    helperGlobals(entity);if(entity.destroyed)continue;
    const previous=entity.state,controllers=helperDefinition(entity,previous).controllers;
    for(let index=0;index<controllers.length;index++){helperController(entity,controllers[index],index);if(entity.destroyed||entity.state!==previous)break}
    if(entity.destroyed)continue;
    if(entity.state!==previous)continue;
   }else if(!entity.removing){
    const invisible=entity.scale.every(value=>value===0);
    if(invisible&&entity.parentKey&&!entities.some(parent=>parent.key===entity.parentKey&&!parent.destroyed)||!invisible&&api.projectileOutside?.(entity)){entity.destroyed=true;continue}
    if(entity.removetime===0)removeProjectile(entity,'expire');
    if(entity.removetime>0)entity.removetime--;
   }
   if(entity.kind==='helper')api.advanceMoveContact?.(entity);
   if(entity.moveContact>0)entity.moveContact++;if(entity.moveHit>0)entity.moveHit++;if(entity.moveGuarded>0)entity.moveGuarded++;
   if(entity.kind==='helper')api.finishHitFrame?.(entity);api.reversalContacts?.();hit(entity);
   if(entity.kind==='helper')api.stepCornerPush?.(entity);
   if(!entity.positionFrozen){entity.x+=entity.vx;entity.y+=entity.vy}if(entity.kind==='helper'){const constants=api.data(entity.player).constants||api.data(entity.player).locomotionConstants||{},standFriction=api.movementFriction?.(entity,'S')??movementHitFriction(entity,constants,'S'),crouchFriction=api.movementFriction?.(entity,'C')??movementHitFriction(entity,constants,'C'),standThreshold=Number(api.data(entity.player).coordinateSystem?.webWorldWidth??1280)/320*(api.nativeGameWidth?.()??320)/320,result=stepZPhysics(entity.z??0,entity.vz??0,{physics:entity.physics,frozen:!!entity.positionFrozen,standFriction,crouchFriction,standThreshold});if(entity.physics==='S'||entity.physics==='C')entity.vx=stepZPhysics(0,entity.vx,{physics:entity.physics,frozen:true,standFriction,crouchFriction,standThreshold}).velocity;entity.z=result.position;entity.vz=result.velocity;api.depthBound?.(entity)}entity.time++;api.advance(entity);
   if(entity.removing&&entity.time>=api.duration(entity.anim,entity.player))entity.destroyed=true;
  }
  const projectiles=entities.filter(entity=>entity.kind==='projectile'&&!entity.removing&&!entity.destroyed);
  projectiles.sort((first,second)=>first.player-second.player);
  for(let index=0;index<projectiles.length;index++){
   const left=projectiles[index];if(left.removing||left.destroyed||left.remainingHits<0)continue;
   const candidates=sortedProjectileCandidates(left,projectiles.slice(index+1).filter(right=>projectileTeamCanTrade(left,right)&&!right.removing&&!right.destroyed&&right.remainingHits>=0));
   for(const right of candidates){
    if(left.removing||left.destroyed)break;if(right.removing||right.destroyed||!api.projectileOverlap(left,right))continue;
    const canceled=cancelProjectilePair(left,right);if(canceled[0])removeProjectile(left,'cancel');if(canceled[1])removeProjectile(right,'cancel');
   }
  }
  const overrides=[];
  for(const helper of entities.filter(entity=>entity.kind==='helper'&&!entity.destroyed)){
   const opponent=root(helper.player===1?2:1),attacks=[api.attack(opponent),...entities.filter(entity=>entity.player!==helper.player&&!entity.destroyed&&entity.activeHitDef).map(entity=>({...entity,hitDef:entity.activeHitDef}))];
   for(const attack of attacks){
    if(attack?.hitDef?.params?.['reversal.attr'])continue;
    if(!attack?.hitDef?.params||attack.hitDef.hitOnceSpent||helper.notHitBy?.until>api.tick()&&excludesHit(helper.notHitBy.value,attack.hitDef.params.attr,{attackerState:attack.type||opponent.type,projectile:attack.kind==='projectile',compatibility:api.data(helper.player).compatibility}))continue;
    if(helper.hitBy&&!allowsHit(helper.hitBy,attack.hitDef.params.attr,{attackerState:attack.type||opponent.type,projectile:attack.kind==='projectile',compatibility:api.data(helper.player).compatibility}))continue;
    const selected=selectHitOverride(helper.hitOverrides||[],attack.hitDef.params,{attackerState:attack.type||opponent.type,projectile:attack.kind==='projectile',unguardable:attack.assertions?.has('unguardable')});
    if(!selected||selected.miss||!api.collision(attack,helper).contact)continue;
    helper.lastHitOverride=selected;
    const result=api.helperOverrideHit?.(attack,helper);
    if(result)api.recordCornerPush?.(attack,helper,result);
    if(result){helper.life=result.life;helper.getHit=result.getHit;helper.hitPause=result.defenderPause;helper.sprPriority=result.defenderPriority;if(result.forceAirApplied)helper.type='A';if(!result.keepState&&!selected.override.keepState)helper.moveType='H';consumeHitOnceContact(attack.hitDef,{accepted:true,isProjectile:attack.kind==='projectile'});}
    if(!helper.getHit?.keepstate&&!selected.override.keepState&&selected.override.state>=0)overrides.push([helper,selected.override.state]);
    break;
   }
  }
  for(const [helper,nextState] of overrides){enter(helper,nextState);for(const [index,controller] of helperDefinition(helper,helper.state).controllers.entries())helperController(helper,controller,index)}
  for(let index=entities.length-1;index>=0;index--)if(entities[index].destroyed){if(entities[index].kind==='helper')api.forgetHitState?.(entities[index]);entities.splice(index,1)}
 }
 function finishTick(){
  api.finishPaletteEffects?.();
  const moveSlot=pauses.super.some(pause=>pause?.remaining>0)?'super':'normal';if(pauses[moveSlot].some(pause=>pause?.remaining>0&&pause.created!==api.tick()))for(const value of moveTimes.values())if(value[moveSlot]>0)value[moveSlot]--;
  const superActive=pauses.super.some(pause=>pause?.remaining>0);
  for(const slot of ['super','normal'])for(const [index,pause] of pauses[slot].entries())if(pause&&pause.created!==api.tick()){if(slot==='normal'&&superActive)continue;pause.remaining--;if(pause.movetime>0)pause.movetime--;if(pause.remaining<=0)pauses[slot][index]=null}
 }
 return {entities,pauses,moveTimes,setMoveTime:(actor,slot,value)=>{const key=moveTimeKey(actor),times=moveTimes.get(key)||{};times[slot]=value;moveTimes.set(key,times)},stagePaused:()=>pauses.super.some(pause=>pause?.remaining>0)&&stagePauseFlags.super||pauses.normal.some(pause=>pause?.remaining>0)&&stagePauseFlags.normal,blocked,context,numeric,dispatch,step,finishTick,enterState:enter,
  unhittable:player=>unhittableUntil[player]>api.tick(),
  numProj:(player,id)=>entities.filter(entity=>entity.kind==='projectile'&&entity.player===player&&entity.id===id&&!entity.destroyed).length,
  projectileContact:(player,id)=>projectileContacts.has(player+':'+id)?api.tick()-projectileContacts.get(player+':'+id).tick:-1,
  projectileEvent:(player,id,kind)=>{const contact=projectileContacts.get(player+':'+id);return !!contact&&api.tick()-contact.tick===1&&(kind==='contact'||kind==='guarded'&&contact.guarded||kind==='hit'&&!contact.guarded)},
  reset:()=>{entities.length=0;projectileContacts.clear();moveTimes.clear();pauses.normal.fill(null);pauses.super.fill(null);unhittableUntil[1]=0;unhittableUntil[2]=0;stagePauseFlags.normal=true;stagePauseFlags.super=true;api.background([256,256,256])}};
}
