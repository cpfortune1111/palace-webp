export function createPlayerPushState(enabled=true){return {enabled,priority:0,affectTeam:1}}

export function applyPlayerPushController(controller,caller,api){
 if(String(controller.type).toLowerCase()!=='playerpush')return false;
 const params=controller.params||{};
 if(['value','priority','affectteam'].every(field=>params[field]===undefined))throw Error('Must specify at least one PlayerPush parameter');
 let affectTeam;
 if(params.affectteam!==undefined){const first=String(params.affectteam).trim()[0]?.toUpperCase();affectTeam={E:1,F:-1,B:0}[first];if(affectTeam===undefined)throw Error('Invalid PlayerPush affectteam')}
 const owner=params.redirectid===undefined?caller:api.findActor(Math.trunc(Number(api.evaluate(params.redirectid)))|0);
 if(!owner)return true;
 const state=api.state(owner);
 if(params.value!==undefined)state.enabled=Number(api.evaluate(params.value))!==0;
 if(params.priority!==undefined)state.priority=Math.trunc(Number(api.evaluate(params.priority)))|0;
 if(affectTeam!==undefined)state.affectTeam=affectTeam;
 return true;
}

export function playerPushShares(first,second,sameTeam=false){
 if(!first.enabled||!second.enabled||sameTeam&&first.affectTeam>0&&second.affectTeam>0||!sameTeam&&(first.affectTeam<0||second.affectTeam<0))return null;
 return first.priority===second.priority?[0.5,0.5]:first.priority>second.priority?[0,1]:[1,0];
}

