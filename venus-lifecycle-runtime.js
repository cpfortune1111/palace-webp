export function createLifecycleRuntime(api){
 const rounds={state:2,number:1,existed:0,match:1};
 const canonicalTypes={varset:'VarSet',varadd:'VarAdd',parentvarset:'ParentVarSet'};
 const controllerType=controller=>canonicalTypes[controller.type.toLowerCase()]||controller.type;
 const number=(expression,context)=>Number(api.eval(expression,context));
 function execute(controller,fighter,context){
  if(!api.trigger(controller,context))return false;
  const params=controller.params,type=controllerType(controller);
  switch(type){
   case 'VarRangeSet':{
    const floating=params.fvalue!==undefined,variables=floating?fighter.fvars:fighter.vars;
    if(!variables)throw Error('Missing lifecycle variable storage');
    const first=number(params.first??0,context),last=number(params.last??variables.length-1,context);
    if(!Number.isInteger(first)||!Number.isInteger(last)||first<0||last>=variables.length)throw Error('Invalid VarRangeSet range');
    const value=number(floating?params.fvalue:params.value,context);
    for(let index=first;index<=last;index++)variables[index]=value;
    break;
   }
   case 'PowerSet':fighter.power=number(params.value,context);break;
   case 'DisplayToClipboard':api.debug?.(fighter,params,context);break;
   default:api.controller({...controller,type},fighter,context);
  }
  return true;
 }
 function globals(fighter,context,{hitPause=false}={}){
  for(const stateNo of [-3,-2])for(const controller of api.data().globalControllers[String(stateNo)]){
   if(hitPause&&Number(controller.params.ignorehitpause??0)!==1)continue;
   execute(controller,fighter,context);
  }
 }
 function initialize(fighter,context){
  if(fighter.state!==5900)throw Error('Initialization requires State 5900');
  const original=fighter.state;
  for(const controller of api.data().lifecycleStates['5900'].controllers){
   execute(controller,fighter,context);
   if(fighter.state!==original)break;
  }
 }
 function queries(fighter,opponent,helpers=[]){
  return {
   query(name){
    const key=name.toLowerCase().replace(/\s+/g,' ');
    const values={roundstate:rounds.state,roundno:rounds.number,roundsexisted:rounds.existed,matchno:rounds.match,
     numpartner:0,numenemy:1,teammode:'Single',teamside:fighter.player,id:fighter.instanceId??(fighter.kind==='helper'?undefined:fighter.id??fighter.player),
     facing:fighter.facing,p2movetype:opponent.moveType,'p2dist y':opponent.y-fighter.y};
    if(!(key in values))throw Error('Unsupported lifecycle query '+name);
    return values[key];
   },
   numHelper:id=>helpers.filter(helper=>helper.kind==='helper'&&helper.player===fighter.player&&!helper.destroyed&&(id===undefined||helper.id===id)).length,
   playerIDExist:id=>[fighter,opponent,...helpers.filter(helper=>helper.kind==='helper'&&!helper.destroyed)].some(entity=>(entity.instanceId??(entity.kind==='helper'?undefined:entity.id??entity.player))===id),
   redirect(name){
    if(name.toLowerCase()==='partner')return null;
    if(['enemy','enemynear'].includes(name.toLowerCase()))return opponent;
    if(['root','parent'].includes(name.toLowerCase()))return api.root(fighter.player);
    throw Error('Unsupported lifecycle redirect '+name);
   }
  };
 }
 return {rounds,execute,globals,initialize,queries};
}
