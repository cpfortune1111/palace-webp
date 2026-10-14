import {rootEnemyList} from '../../Engine/enemy-selection.js';
export function createLifecycleRuntime(api){
 const rounds={state:2,number:1,existed:0,match:1};
 const canonicalTypes={varset:'VarSet',varadd:'VarAdd',parentvarset:'ParentVarSet'};
 const controllerType=controller=>canonicalTypes[controller.type.toLowerCase()]||controller.type;
 const number=(expression,context)=>Number(api.eval(expression,context));
 function execute(controller,fighter,context){
  const params=controller.params,type=controllerType(controller);
  switch(type){
   case 'VarRangeSet':case 'VarRandom':case 'PowerSet':api.controller({...controller,type,controllerSchedulingKey:controller.controllerSchedulingKey||controller},fighter,context);break;
   case 'DisplayToClipboard':if(api.trigger(controller,context))api.debug?.(fighter,params,context);break;
   default:api.controller({...controller,type,controllerSchedulingKey:controller.controllerSchedulingKey||controller},fighter,context);
  }
  return true;
 }
 function globals(fighter,context,{hitPause=false}={}){
  for(const stateNo of [-3,-2])for(const controller of api.data(fighter.player).globalControllers[String(stateNo)]){
   if(hitPause&&Number(controller.params.ignorehitpause??0)!==1)continue;
   execute({...controller,controllerStateNo:stateNo,controllerSchedulingKey:controller},fighter,context);
  }
 }
 function initialize(fighter,context){
  if(fighter.state!==5900)throw Error('Initialization requires State 5900');
  const original=fighter.state;
  for(const controller of api.data(fighter.player).lifecycleStates['5900'].controllers){
   execute(controller,fighter,context);
   if(fighter.state!==original)break;
  }
 }
 function queries(fighter,opponent,helpers=[]){
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
   numHelper:id=>helpers.filter(helper=>helper.kind==='helper'&&helper.player===fighter.player&&!helper.destroyed&&(id===undefined||helper.id===id)).length,
   playerIDExist:id=>[fighter,opponent,...helpers.filter(helper=>helper.kind==='helper'&&!helper.destroyed)].some(entity=>(entity.instanceId??(entity.kind==='helper'?undefined:entity.id??entity.player))===id),
   redirect(name,index=0){
    if(name.toLowerCase()==='partner')return null;
    if(['enemy','enemynear'].includes(name.toLowerCase()))return index<0?null:enemies(name.toLowerCase()==='enemynear')[index]??null;
    if(['root','parent'].includes(name.toLowerCase()))return api.root(fighter.player);
    throw Error('Unsupported lifecycle redirect '+name);
   }
  };
 }
 return {rounds,execute,globals,initialize,queries};
}
