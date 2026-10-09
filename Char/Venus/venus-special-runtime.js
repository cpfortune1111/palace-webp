export function createSpecialRuntime(api){
 const entities=[],pauses={normal:null,super:null},unhittableUntil={1:0,2:0};let serial=0,bgTime=0,bgCreated=-1;
 const root=player=>api.root(player);
 const endsAtCameraTop=entity=>entity.kind==='projectile'&&api.data(entity.player).userOverrides?.[String(entity.id)]?.cameraTopEnding&&entity.anim===Number(entity.params.projanim);
 const blocked=(player,entity=null)=>{
  const pause=pauses.super?.remaining>0?pauses.super:pauses.normal?.remaining>0?pauses.normal:null;
  if(!pause||pause.created===api.tick())return false;
  if(entity)return !(Number(entity[pause.kind==='super'?'supermovetime':'pausemovetime']||0)>0);
  return pause.player!==player||pause.movetime<=0;
 };
 const numeric=(params,context)=>{
  const result={...params};
  for(const key of ['damage','ground.velocity','guard.velocity','air.velocity','ground.cornerpush.veloff','guard.cornerpush.veloff','air.cornerpush.veloff','offset','velocity','p1facing','p2facing','p1stateno','p2stateno'])if(params[key]!==undefined&&!/^[\s\d.,+-]+$/.test(params[key]))result[key]=api.pair(params[key]).map(value=>api.eval(value,context)).join(',');
  if(result.priority!==undefined&&!String(result.priority).includes(','))result.priority+=', Hit';
  return result;
 };
 function context(entity,commands=api.commands(entity.player)){
  const base=api.context(entity,root(entity.player===1?2:1),commands);
  return {...base,rootVar:index=>root(entity.player).vars[index]||0,numProj:id=>entities.filter(item=>item.player===entity.player&&item.kind==='projectile'&&item.id===id&&!item.destroyed).length,
   numExplod:id=>api.effects.filter(effect=>effect.ownerKey===entity.key&&effect.id===id).length,
   query:name=>name.toLowerCase()==='hitcount'?entity.hitCount||0:base.query(name)};
 }
 function enter(entity,state){
  const definition=api.data(entity.player).helperStates[String(state)]||api.data(entity.player).lifecycleHelpers?.[String(state)];if(!definition)throw Error('Unknown helper state '+state);
  Object.assign(entity,{state,time:0,type:definition.type??entity.type,physics:definition.physics??entity.physics,moveType:definition.moveType??entity.moveType,ctrl:definition.ctrl??entity.ctrl,animStartTime:0,once:new Set(),moveContact:0,moveHit:0,moveGuarded:0,activeHitDef:null});
  entity.sprPriority=definition.sprpriority??entity.sprPriority;
  if(definition.anim!==undefined){entity.anim=definition.anim;entity.elem=1;entity.elemTick=0}
 }
 function spawn(params,owner,player,kind){
  const sourceContext=context({...owner,player,key:owner.key||'root'+player});
  const values=numeric(params,sourceContext),offset=String(values.offset||values.pos||'0,0').split(',').map(Number),velocity=String(values.velocity||'0,0').split(',').map(Number);
  const entity={kind,key:'entity'+(++serial),player,abilityState:owner.abilityState??owner.state,id:Number(params.projid??params.id),x:owner.x+(offset[0]||0)*owner.facing,y:owner.y+(offset[1]||0),facing:owner.facing,
   vx:(velocity[0]||0)*owner.facing,vy:velocity[1]||0,time:0,anim:Number(params.projanim),animStartTime:0,elem:1,elemTick:0,type:'A',moveType:'A',ctrl:0,vars:Array(60).fill(0),sysvars:Array(10).fill(0),
   life:1000,hitCount:0,hitPause:0,moveContact:0,moveHit:0,moveGuarded:0,sprPriority:Number(params.projsprpriority??-1),supermovetime:Number(params.supermovetime||0),pausemovetime:Number(params.pausemovetime||0),once:new Set(),created:api.tick(),params:values};
  entity.instanceId=1000+serial;
  if(kind==='projectile'){entity.activeHitDef={hitKey:entity.key,params:values};entity.removetime=Number(params.projremovetime??-1);entity.priority=Number(params.projpriority??1)}
  else enter(entity,Number(params.stateno));
  entities.push(entity);return entity;
 }
 function startPause(params,player,kind){
  const remaining=Number(params.time),movetime=Number(params.movetime||0),slot=kind==='super'?'super':'normal',previous=pauses[slot];
  if(!previous||previous.player===player||remaining>previous.remaining)pauses[slot]={kind,remaining,movetime:movetime>remaining?0:movetime,player,created:api.tick()};
  if(kind==='super'){if(params.sound){if(/^S/i.test(params.sound))api.sound(params.sound,player===1?0:4,player);else {const sound=String(params.sound).split(',').map(Number);api.commonSound(sound[0],sound[1],player===1?0:4)}}if(Number(params.unhittable??1))unhittableUntil[player]=api.tick()+remaining+1}
 }
 function dispatch(controller,binding,sourceContext,adapter,owner,player){
  const params=controller.params;
  switch(controller.type){
   case 'Projectile':spawn(params,owner,player,'projectile');return true;
   case 'Helper':spawn(params,owner,player,'helper');return true;
   case 'Pause':startPause(params,player,'normal');return true;
   case 'SuperPause':startPause(params,player,'super');return true;
   case 'BGPalFX':api.background(String(params.mul).split(',').map(Number));bgTime=Number(params.time);bgCreated=api.tick();return true;
   case 'RemoveExplod':for(let index=api.effects.length-1;index>=0;index--)if(api.effects[index].ownerKey===(owner.key||'root'+player)&&(params.id===undefined||api.effects[index].id===Number(params.id)))api.effects.splice(index,1);return true;
   case 'StopSnd':api.stopSound(Number(params.channel||0)+(player===2?4:0));return true;
   default:return false;
  }
 }
 function helperController(entity,controller,index){
  const canonical={varset:'VarSet',varadd:'VarAdd',parentvarset:'ParentVarSet'};
  controller={...controller,type:canonical[controller.type.toLowerCase()]||controller.type};
  const ctx=context(entity);if(!api.trigger(controller,ctx)||Number(controller.params.persistent)===0&&entity.once.has(index))return;
  entity.once.add(index);const params=controller.params;
  if(dispatch(controller,entity,ctx,{},entity,entity.player))return;
  switch(controller.type){
   case 'HitDef':if(!entity.activeHitDef)entity.activeHitDef={hitKey:entity.key+':'+(++serial),params:numeric(params,ctx)};break;
   case 'ParentVarSet':root(entity.player).vars[Number(params.target.match(/\d+/)[0])]=api.eval(params.value,ctx);break;
   case 'BindtoRoot':entity.bindUntil=entity.time+Number(params.time);entity.bindOffset=api.pair(params.pos).map(value=>api.eval(value,ctx));break;
   case 'Explod':api.explod(params,entity,entity.player,ctx);break;
   case 'HitOverride':entity.overrideState=Number(params.stateno);entity.overrideAttr=params.attr;break;
   case 'HitBy':entity.hitBy=params.value;break;
   case 'PlayerPush':entity.playerPush=!!Number(params.value);break;
   case 'AssertSpecial':if(String(params.flag).toLowerCase()==='invisible')entity.invisible=true;else if(params.flag!=='NoShadow')throw Error('Unsupported helper assertion');break;
   case 'DestroySelf':entity.destroyed=true;break;
   default:api.controller(controller,entity,ctx,{changeState:state=>enter(entity,state)});
  }
 }
 function hit(entity){
  const defender=root(entity.player===1?2:1);
  if(entity.hitSpent||!entity.activeHitDef||!api.collision({...entity,hitDef:entity.activeHitDef},defender).contact)return;
  if(entity.activeHitDef.params.nochainid!==undefined&&Number(entity.activeHitDef.params.nochainid)===Number(defender.getHit?.hitid))return;
  const result=api.hit(entity,defender,entity.activeHitDef.params);
  if(!result)return;
  entity.hitSpent=true;
  entity.moveContact=1;entity.moveHit=result.guarded?0:1;entity.moveGuarded=result.guarded?1:0;entity.hitCount+=result.guarded?0:1;
  entity.hitPause=result.attackerPause;
  if(entity.kind==='projectile'){
   entity.activeHitDef=null;entity.removing=true;entity.anim=Number(entity.params.projhitanim??-1);entity.time=0;entity.animStartTime=0;entity.elem=1;entity.elemTick=0;entity.vx=0;entity.vy=0;
   if(entity.anim<0)entity.destroyed=true;
  }
 }
 function removeProjectile(entity,reason){
  entity.removing=true;entity.activeHitDef=null;entity.vx=0;entity.vy=0;
  const selected=entity.params[reason==='camera-top'?'projhitanim':reason==='cancel'?'projcancelanim':'projremanim'];
  if(selected!==undefined){entity.anim=Number(selected);entity.time=0;entity.elem=1;entity.elemTick=0}
  else entity.time=api.frames(entity.anim,entity.player).slice(0,entity.elem-1).reduce((total,frame)=>total+Math.max(1,Number(frame.time)||1),0)+entity.elemTick;
  entity.animStartTime=0;if(entity.anim<0||api.duration(entity.anim,entity.player)<=0)entity.destroyed=true;
 }
 function step(){
  for(const entity of [...entities]){
   if(entity.destroyed||blocked(entity.player,entity))continue;
   if(entity.hitPause>0){entity.hitPause--;continue}
   if(entity.created===api.tick())continue;
   if(entity.kind==='helper'){
    entity.randomValue=Math.floor(Math.random()*1000);
    const previous=entity.state,controllers=(api.data(entity.player).helperStates[String(previous)]||api.data(entity.player).lifecycleHelpers[String(previous)]).controllers;
    for(let index=0;index<controllers.length;index++){helperController(entity,controllers[index],index);if(entity.destroyed||entity.state!==previous)break}
    if(entity.destroyed)continue;
    if(entity.bindUntil>entity.time){const parent=root(entity.player);entity.x=parent.x+(entity.bindOffset[0]||0)*parent.facing;entity.y=parent.y+(entity.bindOffset[1]||0);entity.facing=parent.facing}
   }else if(!entity.removing){
    const height=String(entity.params.projheightbound||'-960,4').split(',').map(Number);
    const cameraTopEnding=endsAtCameraTop(entity);
    if((!cameraTopEnding&&entity.removetime===0)||entity.x<api.camera()-800||entity.x>api.camera()+800||entity.x<-3910||entity.x>3910||(entity.vy>0&&entity.y>height[1])||(!cameraTopEnding&&entity.vy<0&&entity.y<height[0]))removeProjectile(entity,'expire');
    if(!cameraTopEnding&&entity.removetime>0)entity.removetime--;
   }
   if(entity.moveContact>0)entity.moveContact++;if(entity.moveHit>0)entity.moveHit++;if(entity.moveGuarded>0)entity.moveGuarded++;
   hit(entity);
   entity.x+=entity.vx;entity.y+=entity.vy;entity.time++;api.advance(entity);
   if(endsAtCameraTop(entity)&&!entity.removing&&entity.vy<0){
    const top=api.projectileTop(entity),edge=api.cameraTop();
    if(entity.y+top<=edge){entity.y=edge-top;removeProjectile(entity,'camera-top')}
   }
   if(entity.removing&&entity.time>=api.duration(entity.anim,entity.player))entity.destroyed=true;
  }
  const projectiles=entities.filter(entity=>entity.kind==='projectile'&&!entity.removing&&!entity.destroyed);
  for(let first=0;first<projectiles.length;first++)for(let second=first+1;second<projectiles.length;second++){
   const left=projectiles[first],right=projectiles[second];if(left.player===right.player||!api.collision({...left,hitDef:left.activeHitDef},right).overlap)continue;
   if(left.priority<=right.priority)removeProjectile(left,'cancel');if(right.priority<=left.priority)removeProjectile(right,'cancel');
  }
  for(const helper of entities.filter(entity=>entity.kind==='helper'&&!entity.destroyed)){
   const opponent=root(helper.player===1?2:1),attacks=[api.attack(opponent),...entities.filter(entity=>entity.player!==helper.player&&!entity.destroyed&&entity.activeHitDef).map(entity=>({...entity,hitDef:entity.activeHitDef}))];
   if(helper.hitBy&&attacks.some(attack=>attack&&/[SCA],\s*H[AP]/.test(attack.hitDef.params.attr)&&api.collision(attack,helper).contact)){enter(helper,helper.overrideState);for(const [index,controller] of api.data(helper.player).helperStates[String(helper.state)].controllers.entries())helperController(helper,controller,index)}
  }
  for(let index=entities.length-1;index>=0;index--)if(entities[index].destroyed)entities.splice(index,1);
 }
 function finishTick(){
  const superActive=pauses.super?.remaining>0;
  for(const slot of ['super','normal']){const pause=pauses[slot];if(pause&&pause.created!==api.tick()){if(slot==='normal'&&superActive)continue;pause.remaining--;if(pause.movetime>0)pause.movetime--;if(pause.remaining<=0)pauses[slot]=null}}
  if(bgTime>0&&bgCreated!==api.tick()&&--bgTime===0)api.background([256,256,256]);
 }
 return {entities,pauses,blocked,context,numeric,dispatch,step,finishTick,
  unhittable:player=>unhittableUntil[player]>api.tick(),
  numProj:(player,id)=>entities.filter(entity=>entity.kind==='projectile'&&entity.player===player&&entity.id===id&&!entity.destroyed).length,
  reset:()=>{entities.length=0;pauses.normal=null;pauses.super=null;unhittableUntil[1]=0;unhittableUntil[2]=0;bgTime=0;api.background([256,256,256])}};
}
