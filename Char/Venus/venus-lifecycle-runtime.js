import {rootEnemyList} from '../../Engine/enemy-selection.js';
import {parseCnsIntegerLiteral} from '../../Engine/cns-integer-literal.js';
import {lookupControllerCharacter} from '../../Engine/controller-character-lookup.js';
export function findParentActor(actor,helpers,root){
 if(actor.kind!=='helper')return null;
 if(!actor.parentKey)return root(actor.player);
 if(actor.parentKey==='root1'||actor.parentKey==='root2')return root(Number(actor.parentKey.slice(-1)));
 return helpers.find(helper=>helper.kind==='helper'&&helper.key===actor.parentKey&&!helper.destroyed)??null;
}
export function createLifecycleRuntime(api){
 const rounds={state:2,number:1,existed:0,match:1};
 const canonicalTypes={varset:'VarSet',varadd:'VarAdd',parentvarset:'ParentVarSet'};
 const controllerType=controller=>canonicalTypes[controller.type.toLowerCase()]||controller.type;
 const number=(expression,context)=>Number(api.eval(expression,context));
 function execute(controller,fighter,context){
  const params=controller.params,type=controllerType(controller);
  switch(type){
   case 'VarRangeSet':case 'VarRandom':case 'PowerSet':return api.controller({...controller,type,controllerSchedulingKey:controller.controllerSchedulingKey||controller},fighter,context);
   case 'DisplayToClipboard':if(api.trigger(controller,context))api.debug?.(fighter,params,context);break;
   default:return api.controller({...controller,type,controllerSchedulingKey:controller.controllerSchedulingKey||controller},fighter,context);
  }
 }
 function globalState(fighter,context,stateNo,{hitPause=false}={}){
  for(const [index,controller] of (api.data(fighter.player).globalControllers?.[String(stateNo)]??[]).entries()){
   api.visitController?.(fighter,index);
   if(hitPause&&!parseCnsIntegerLiteral(controller.params.ignorehitpause??0))continue;
   const outcome=execute({...controller,controllerStateNo:stateNo,controllerSchedulingKey:controller,controllerSchedulingIndex:index},fighter,context);
   if(outcome?.stateTransition&&!outcome.continueBody)return outcome;
  }
 }
 function globals(fighter,context,options={}){for(const stateNo of [-3,-2])globalState(fighter,context,stateNo,options)}
 function initialize(fighter,context){
  if(fighter.state!==5900)throw Error('Initialization requires State 5900');
  const original=fighter.state;
  for(const controller of api.data(fighter.player).lifecycleStates['5900'].controllers){
   execute(controller,fighter,context);
   if(fighter.state!==original)break;
  }
 }
 function queries(fighter,opponent,helpers=[]){
  const character=id=>api.character?api.character(id):lookupControllerCharacter(id,targetId=>[api.root(1),api.root(2),...helpers.filter(helper=>helper.kind==='helper')].find(actor=>(actor.instanceId??(actor.kind==='helper'?undefined:actor.id??actor.player))===targetId));
  const p2=()=>api.p2?api.p2(fighter):opponent;
  const enemies=near=>rootEnemyList(fighter,[api.root(1),api.root(2)],{near,distance:api.enemyDistance});
  return {
   query(name){
    const key=name.toLowerCase().replace(/\s+/g,' '),selectedP2=['p2movetype','p2dist y'].includes(key)?p2():null;
    const values={roundstate:rounds.state,roundno:rounds.number,roundsexisted:rounds.existed,matchno:rounds.match,
     numpartner:0,numenemy:key==='numenemy'?enemies(false).length:0,teammode:'Single',teamside:fighter.teamSide??fighter.player,id:fighter.instanceId??(fighter.kind==='helper'?undefined:fighter.id??fighter.player),
     facing:fighter.facing,p2movetype:selectedP2?.moveType??NaN,'p2dist y':selectedP2?selectedP2.y-fighter.y:NaN};
    if(!(key in values))throw Error('Unsupported lifecycle query '+name);
    return values[key];
   },
   numHelper:id=>helpers.filter(helper=>helper.kind==='helper'&&helper.player===fighter.player&&!helper.destroyed&&(id===undefined||id<=0||helper.id===id)).length,
   playerIDExist:id=>!!character(id),
   redirect(name,index=0){
    if(name.toLowerCase()==='playerid')return character(index);
    if(name.toLowerCase()==='partner')return null;
    if(['enemy','enemynear'].includes(name.toLowerCase()))return index<0?null:enemies(name.toLowerCase()==='enemynear')[index]??null;
    if(name.toLowerCase()==='parent')return findParentActor(fighter,helpers,api.root);
    if(name.toLowerCase()==='root')return api.root(fighter.player);
    throw Error('Unsupported lifecycle redirect '+name);
   }
  };
 }
 return {rounds,execute,globalState,globals,initialize,queries};
}
