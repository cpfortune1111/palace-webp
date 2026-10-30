export function primeRoundPortraits({data,root,spawnHelper,spawnEffect,entities}){
 for(const player of [1,2]){
  const id=player===1?915:925,bundle=data(player);
  const definition=bundle.helperStates?.[id]||bundle.lifecycleHelpers?.[id];if(!definition)continue;
  let helper=entities.find(e=>e.player===player&&e.kind==='helper'&&e.id===id&&!e.destroyed);
  if(!helper){
   const source=Object.values(bundle.globalControllers||{}).flat().find(c=>c.type==='Helper'&&Number(c.params.stateno)===id);
   spawnHelper(player,source||{type:'Helper',params:{id:String(id),stateno:String(id),supermovetime:'9999999999',pausemovetime:'9999999999'}});
   helper=entities.find(e=>e.player===player&&e.kind==='helper'&&e.id===id&&!e.destroyed);
  }
  const low=root(player).life<=root(player).lifeMax/4,animation=id+(low?3:0);
  const portrait=definition.controllers.find(c=>c.type==='Explod'&&Number(c.params.anim)===animation);
  if(helper&&portrait)spawnEffect(player,portrait.params,helper);
 }
}
