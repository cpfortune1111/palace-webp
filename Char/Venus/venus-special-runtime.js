import {createPlayerPushState} from '../../Engine/player-push.js?v=02475';
import {createScreenBoundFlags} from '../../Engine/screen-bound.js?v=02474';
import {createWidthModifiers} from '../../Engine/width-controller.js?v=02473';
import {helperTypeParameter} from '../../Engine/target-power.js?v=02465';
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
 const projectileContacts=new Map();
 const root=player=>api.root(player);
 const blocked=(player,entity=null)=>{
  const slot=pauses.super.some(pause=>pause?.remaining>0)?'super':'normal',active=pauses[slot].filter(pause=>pause?.remaining>0&&pause.created!==api.tick());
  if(!active.length)return false;
  if(entity){const allowance=Number(entity[slot==='super'?'supermovetime':'pausemovetime']||0),start=Math.max(Math.min(...active.map(pause=>pause.created)),entity.created??-Infinity);return api.tick()-start>allowance}
  if(!pauses[slot][player-1]?.movetime&&api.trigger){const fighter=root(player),data=api.data(player),definition=data.states?.[String(fighter.state)]||data.attackStates?.[String(fighter.state)]||data.locomotionStates?.[String(fighter.state)];if(fighter.time===0){const pending=definition?.controllers.find(controller=>controller.type===(slot==='super'?'SuperPause':'Pause')&&Number(controller.params.movetime)>0&&api.trigger(controller,context(fighter)));if(pending){const remaining=Number(pending.params.time);pauses[slot][player-1]={kind:slot,remaining,movetime:Math.min(remaining,Number(pending.params.movetime)),player,created:api.tick()}}}}
  return !(pauses[slot][player-1]?.movetime>0);
 };
 const numeric=(params,context)=>{
  const result={...params};
  if(['snap','mindist','maxdist'].some(key=>params[key]!==undefined))result.hitPosition=prepareHitPosition(params,{splitPair:api.pair,evaluate:value=>api.eval(value,context)});
  for(const key of ['damage','ground.velocity','guard.velocity','air.velocity','airguard.velocity','down.velocity','airguard.cornerpush.veloff','airguard.cornerpush.velmul','ground.cornerpush.veloff','guard.cornerpush.veloff','air.cornerpush.veloff','offset','velocity','p1facing','p2facing','p1stateno','p2stateno'])if(params[key]!==undefined&&!/^[\s\d.,+-]+$/.test(params[key]))result[key]=api.pair(params[key]).map(value=>api.eval(value,context)).join(',');
  if(result.priority!==undefined&&!String(result.priority).includes(','))result.priority+=', Hit';
  for(const key of ['hitredlife','guardredlife','dizzypoints','guardpoints','airguard.ctrltime','numhits','down.hittime','fall.recovertime','p1facing','p1getp2facing','p2facing','missonoverride'])if(params[key]!==undefined)result[key]=Math.trunc(Number(api.eval(params[key],context)))|0;
  for(const key of ['hitonce','forcestand','forcecrouch','down.bounce','fall.recover'])if(params[key]!==undefined)result[key]=Number(api.eval(params[key],context))!==0?1:0;
  for(const key of ['projanim','projhitanim','projremanim','projcancelanim','projhits','projmisstime','projremovetime'])if(params[key]!==undefined)result[key]=api.eval(params[key],context);
  return result;
 };
 function context(entity,commands=api.commands(entity.player)){
  const base=api.context(entity,root(entity.player===1?2:1),commands);
  return {...base,rootVar:index=>root(entity.player).vars[index]||0,numProj:id=>entities.filter(item=>item.player===entity.player&&item.kind==='projectile'&&item.id===id&&!item.destroyed).length,
   numExplod:id=>api.effects.filter(effect=>effect.ownerKey===entity.key&&effect.id===id).length,
   query:name=>name.toLowerCase()==='hitcount'?entity.hitCount||0:name.toLowerCase()==='guardcount'?entity.guardCount||0:base.query(name)};
 }
 function helperDefinition(entity,state){const data=api.data(entity.player);return data.helperStates[String(state)]||data.lifecycleHelpers?.[String(state)]||data.states?.[String(state)]}
 function enter(entity,state){
  const definition=helperDefinition(entity,state);if(!definition)throw Error('Unknown helper state '+state);
  if(!definition.hitdefpersist)entity.guardHitDef=null;
  Object.assign(entity,{state,time:0,type:definition.type??entity.type,physics:definition.physics??entity.physics,moveType:definition.moveType??entity.moveType,ctrl:definition.ctrl??entity.ctrl,animStartTime:0,once:new Set(),moveContact:0,moveHit:0,moveGuarded:0,guardCount:0,activeHitDef:null});
  entity.controllerSchedule=createControllerSchedule();
  entity.sprPriority=definition.sprpriority??entity.sprPriority;
  if(definition.velset){entity.vx=definition.velset[0]*entity.facing;entity.vy=definition.velset[1]}
  if(definition.anim!==undefined){entity.anim=definition.anim;entity.elem=1;entity.elemTick=0}
 }
 function spawn(params,owner,player,kind){
  const sourceContext=context({...owner,player,key:owner.key||'root'+player});
  const values=numeric(params,sourceContext),offset=String(values.offset||values.pos||'0,0').split(',').map(Number),velocity=String(values.velocity||'0,0').split(',').map(Number);
  const entity={kind,parentKey:owner.kind==='helper'?owner.key:null,key:'entity'+(++serial),player,abilityState:owner.abilityState??owner.state,id:Number(params.projid??params.id),x:owner.x+(offset[0]||0)*owner.facing,y:owner.y+(offset[1]||0),facing:owner.facing,
   vx:(velocity[0]||0)*owner.facing,vy:velocity[1]||0,time:0,anim:Number(params.projanim),animStartTime:0,elem:1,elemTick:0,type:'A',moveType:'A',ctrl:0,vars:Array(60).fill(0),sysvars:Array(10).fill(0),
   life:1000,attackState:kind==='projectile'?{...(owner.attackState||createAttackState())}:createAttackState(),angleState:createAngleState(),maps:new Map(owner.mapDefaults||[]),mapDefaults:new Map(owner.mapDefaults||[]),fvars:Array(40).fill(0),hitCount:0,guardCount:0,hitPause:0,moveContact:0,moveHit:0,moveGuarded:0,sprPriority:Number(params.projsprpriority??-1),supermovetime:Number(params.supermovetime||0),pausemovetime:Number(params.pausemovetime||0),once:new Set(),created:api.tick(),params:values};
  entity.instanceId=1000+serial;
  if(kind==='helper'){entity.hitOverrides=createHitOverrides();entity.helperType=helperTypeParameter(params.helpertype);entity.ownsPalette=Number(api.eval(params.ownpal??0,sourceContext))!==0;entity.paletteParentKey=owner.kind==='helper'?owner.key:'root'+player;api.initializePalette?.(entity,owner)}
  if(kind==='helper'&&params.extendsmap!==undefined&&api.eval(params.extendsmap,sourceContext))for(const [name,value] of owner.maps||[])entity.maps.set(name,value);
  if(kind==='projectile'){entity.anim=Number(values.projanim);entity.scale=String(params.projscale||'1,1').split(',').map(Number);entity.activeHitDef=values.attr?{hitKey:entity.key,guardDistance:api.projectileGuardHitDef?.(player,params,sourceContext),params:values}:null;entity.removetime=Number(values.projremovetime??-1);entity.priority=Number(params.projpriority??1)}
  else enter(entity,Number(params.stateno));
  if(api.data(player).character==='SailorMoon'&&[3050,3051].includes(entity.state))entity.y=0;
  entities.push(entity);return entity;
 }
 function startPause(params,player,kind,sourceContext){
  const remaining=Number(params.time),movetime=Math.max(0,Math.min(remaining,Number(params.movetime||0))),slot=kind==='super'?'super':'normal';
  stagePauseFlags[slot]=params.pausebg===undefined||Number(api.eval(params.pausebg,sourceContext))!==0;pauses[slot][player-1]=remaining>0?{kind,remaining,movetime,player,created:api.tick()}:null;
  if(kind==='super'){if(params.sound){if(/^S/i.test(params.sound))api.sound(params.sound,player===1?0:4,player);else {const sound=String(params.sound).split(',').map(Number);api.commonSound(sound[0],sound[1],player===1?0:4)}}if(Number(params.unhittable??1))unhittableUntil[player]=api.tick()+remaining+1}
 }
 function dispatch(controller,binding,sourceContext,adapter,owner,player){
  const params=controller.params;
  switch(controller.type){
   case 'Projectile':spawn(params,owner,player,'projectile');return true;
   case 'Helper':if(Number(params.stateno)!==950)spawn(params,owner,player,'helper');return true;
   case 'Pause':startPause(params,player,'normal',sourceContext||context(owner||root(player)));return true;
   case 'SuperPause':startPause(params,player,'super',sourceContext||context(owner||root(player)));return true;
   case 'RemoveExplod':for(let index=api.effects.length-1;index>=0;index--)if(api.effects[index].ownerKey===(owner.key||'root'+player)&&(params.id===undefined||api.effects[index].id===Number(params.id)))api.effects.splice(index,1);return true;
   case 'StopSnd':api.stopSound(Number(params.channel||0)+(player===2?4:0));return true;
   default:return false;
  }
 }
 function helperController(entity,controller,index){
  const canonical={varset:'VarSet',varadd:'VarAdd',parentvarset:'ParentVarSet',parentvaradd:'ParentVarAdd',rootvarset:'RootVarSet',rootvaradd:'RootVarAdd',bindtoroot:'BindtoRoot'};
  controller={...controller,type:canonical[controller.type.toLowerCase()]||controller.type};
  const ctx=context(entity);
  if(!entity.controllerSchedule.before(index,controller.params,{hitPause:entity.hitPause>0})||!api.trigger(controller,ctx))return;
  entity.controllerSchedule.executed(index,controller.params);
  entity.once.add(index);const params=controller.params;
  if(dispatch(controller,entity,ctx,{},entity,entity.player))return;
  switch(controller.type){
   case 'HitDef':entity.activeHitDef={hitKey:entity.key+':'+(++serial),guardDistance:api.guardHitDef?.(entity.player,entity,params,ctx),params:numeric(params,ctx)};entity.hitSpent=false;break;
   case 'Explod':api.explod(params,entity,entity.player,ctx);break;
   case 'HitOverride':api.controller(controller,entity,ctx,{owner:entity,player:entity.player,schedulingApplied:true});break;
   case 'HitBy':case 'NotHitBy':api.controller(controller,entity,ctx,{owner:entity,player:entity.player,schedulingApplied:true});break;
   case 'AssertSpecial':if(api.damageAssertion?.(controller,entity,ctx))break;if(String(params.flag).toLowerCase()==='invisible')entity.invisible=true;else if(String(params.flag).toLowerCase()!=='noshadow')throw Error('Unsupported helper assertion');break;
   case 'DestroySelf':entity.destroyed=true;break;
   default:{const binding=Object.create(entity);Object.defineProperties(binding,{vx:{get:()=>entity.vx*entity.facing,set:value=>{entity.vx=value*entity.facing}},vy:{get:()=>entity.vy,set:value=>{entity.vy=value}},anim:{get:()=>entity.anim,set:value=>{entity.anim=value;entity.animStartTime=entity.time}},elem:{get:()=>entity.elem,set:value=>{entity.elem=value}},elemTick:{get:()=>entity.elemTick,set:value=>{entity.elemTick=value}}});for(const key of ['x','y','facing','sprPriority','ctrl','type','physics','moveType'])Object.defineProperty(binding,key,{get:()=>entity[key],set:value=>{entity[key]=value}});api.controller(controller,binding,ctx,{player:entity.player,owner:entity,changeState:state=>enter(entity,state),playSound:(value,channel)=>api.sound(value,channel<0?channel:channel+(entity.player===2?4:0),entity.player),explod:params=>api.explod(params,entity,entity.player,ctx)});}
  }
 }
 function hit(entity){
  const defender=root(entity.player===1?2:1);
  if(entity.moveType!=='A'||entity.hitSpent||api.tick()<(entity.nextHitTick||0)||!entity.activeHitDef||entity.activeHitDef.hitOnceSpent||!api.collision({...entity,hitDef:entity.activeHitDef},defender).contact)return;
  if(entity.activeHitDef.params.nochainid!==undefined&&Number(entity.activeHitDef.params.nochainid)===Number(defender.getHit?.hitid))return;
  const result=api.hit(entity,defender,entity.activeHitDef.params);
  if(!result)return;
  consumeHitOnceContact(entity.activeHitDef,{accepted:true,isProjectile:entity.kind==='projectile'});
  entity.hitSpent=true;entity.hitTarget=result.guarded?null:defender.player;
  entity.moveContact=1;entity.moveHit=result.guarded?0:1;entity.moveGuarded=result.guarded?1:0;entity.hitCount+=result.guarded?0:hitDefCount(entity.activeHitDef?.params||entity.params||{});entity.guardCount=(entity.guardCount||0)+(result.guarded?hitDefCount(entity.activeHitDef?.params||entity.params||{}):0);
  entity.hitPause=result.attackerPause;
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
   if(entity.destroyed||blocked(entity.player,entity))continue;
   if(entity.kind==='helper'&&(api.data(entity.player).compatibility==='mugen'||!(entity.hitPause>0)))tickHitOverrides(entity.hitOverrides??=createHitOverrides());resetAngleDraw(entity.angleState);if(entity.kind==='helper'){entity.drawOffset=[0,0];entity.transState=null}
   if(entity.kind==='helper')for(const slot of [...(entity.clsnOverrides||[]),...(entity.clsnTransforms||[])])slot.length=0;
   entity.assertions?.clear();
   if(entity.kind==='helper'&&!(entity.hitPause>0))tickHitBySlots(entity.hitBySlots??=createHitBySlots());
   if(entity.hitPause>0){
    if(entity.kind==='helper'){
     const previous=entity.state,controllers=helperDefinition(entity,previous).controllers;
     for(let index=0;index<controllers.length;index++){helperController(entity,controllers[index],index);if(entity.destroyed||entity.state!==previous)break}
    }
    entity.hitPause--;continue;
   }
   if(entity.kind==='helper'){entity.heightModifiers=[0,0];entity.widthModifiers=createWidthModifiers();entity.screenBoundFlags=createScreenBoundFlags(entity.helperType===2);entity.playerPushState=createPlayerPushState(entity.helperType===2&&(api.roundState?.()??2)>0&&(api.roundState?.()??2)<4)}
   if(entity.created===api.tick())continue;
   if(entity.kind==='helper'){
    entity.positionFrozen=false;entity.randomValue=Math.floor(Math.random()*1000);
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
   if(entity.moveContact>0)entity.moveContact++;if(entity.moveHit>0)entity.moveHit++;if(entity.moveGuarded>0)entity.moveGuarded++;
   hit(entity);
   if(!entity.positionFrozen){entity.x+=entity.vx;entity.y+=entity.vy}entity.time++;api.advance(entity);
   if(entity.removing&&entity.time>=api.duration(entity.anim,entity.player))entity.destroyed=true;
  }
  const projectiles=entities.filter(entity=>entity.kind==='projectile'&&!entity.removing&&!entity.destroyed);
  for(let first=0;first<projectiles.length;first++)for(let second=first+1;second<projectiles.length;second++){
   const left=projectiles[first],right=projectiles[second];if(left.player===right.player||!api.collision({...left,hitDef:left.activeHitDef},right).overlap)continue;
   if(left.priority<=right.priority)removeProjectile(left,'cancel');if(right.priority<=left.priority)removeProjectile(right,'cancel');
  }
  const overrides=[];
  for(const helper of entities.filter(entity=>entity.kind==='helper'&&!entity.destroyed)){
   const opponent=root(helper.player===1?2:1),attacks=[api.attack(opponent),...entities.filter(entity=>entity.player!==helper.player&&!entity.destroyed&&entity.activeHitDef).map(entity=>({...entity,hitDef:entity.activeHitDef}))];
   for(const attack of attacks){
    if(!attack?.hitDef?.params||attack.hitDef.hitOnceSpent||helper.notHitBy?.until>api.tick()&&excludesHit(helper.notHitBy.value,attack.hitDef.params.attr,{attackerState:attack.type||opponent.type,projectile:attack.kind==='projectile',compatibility:api.data(helper.player).compatibility}))continue;
    if(helper.hitBy&&!allowsHit(helper.hitBy,attack.hitDef.params.attr,{attackerState:attack.type||opponent.type,projectile:attack.kind==='projectile',compatibility:api.data(helper.player).compatibility}))continue;
    const selected=selectHitOverride(helper.hitOverrides||[],attack.hitDef.params,{attackerState:attack.type||opponent.type,projectile:attack.kind==='projectile',unguardable:attack.assertions?.has('unguardable')});
    if(!selected||selected.miss||!api.collision(attack,helper).contact)continue;
    helper.lastHitOverride=selected;
    const result=api.helperOverrideHit?.(attack,helper);
    if(result){helper.life=result.life;helper.getHit=result.getHit;helper.hitPause=result.defenderPause;helper.sprPriority=result.defenderPriority;if(result.forceAirApplied)helper.type='A';if(!selected.override.keepState)helper.moveType='H';consumeHitOnceContact(attack.hitDef,{accepted:true,isProjectile:attack.kind==='projectile'});}
    if(!selected.override.keepState&&selected.override.state>=0)overrides.push([helper,selected.override.state]);
    break;
   }
  }
  for(const [helper,nextState] of overrides){enter(helper,nextState);for(const [index,controller] of helperDefinition(helper,helper.state).controllers.entries())helperController(helper,controller,index)}
  for(let index=entities.length-1;index>=0;index--)if(entities[index].destroyed)entities.splice(index,1);
 }
 function finishTick(){
  api.finishPaletteEffects?.();
  const superActive=pauses.super.some(pause=>pause?.remaining>0);
  for(const slot of ['super','normal'])for(const [index,pause] of pauses[slot].entries())if(pause&&pause.created!==api.tick()){if(slot==='normal'&&superActive)continue;pause.remaining--;if(pause.movetime>0)pause.movetime--;if(pause.remaining<=0)pauses[slot][index]=null}
 }
 return {entities,pauses,stagePaused:()=>pauses.super.some(pause=>pause?.remaining>0)&&stagePauseFlags.super||pauses.normal.some(pause=>pause?.remaining>0)&&stagePauseFlags.normal,blocked,context,numeric,dispatch,step,finishTick,enterState:enter,
  unhittable:player=>unhittableUntil[player]>api.tick(),
  numProj:(player,id)=>entities.filter(entity=>entity.kind==='projectile'&&entity.player===player&&entity.id===id&&!entity.destroyed).length,
  projectileContact:(player,id)=>projectileContacts.has(player+':'+id)?api.tick()-projectileContacts.get(player+':'+id).tick:-1,
  projectileEvent:(player,id,kind)=>{const contact=projectileContacts.get(player+':'+id);return !!contact&&api.tick()-contact.tick===1&&(kind==='contact'||kind==='guarded'&&contact.guarded||kind==='hit'&&!contact.guarded)},
  reset:()=>{entities.length=0;projectileContacts.clear();pauses.normal.fill(null);pauses.super.fill(null);unhittableUntil[1]=0;unhittableUntil[2]=0;stagePauseFlags.normal=true;stagePauseFlags.super=true;api.background([256,256,256])}};
}
