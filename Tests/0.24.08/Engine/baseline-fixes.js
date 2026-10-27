// Narrow fixes for the historical 0.24.08 test, not the generic engine work.
export function resultNeutralState(root){
 if(root.life<=0||!root.ctrl||root.type==='A')return null;
 // These released-input transitions belong to locomotion, not to AIR/CNS.
 if(root.state===11)return 12;
 if(root.state===20)return 0;
 return null;
}
export function resultFacing(player,root,opponent){
 if(root.life<=0||root.state!==0)return null;
 return opponent.x===root.x?root.facing:opponent.x>root.x?1:-1;
}
export function bindEffects(effects,root,entities,blocked){
 for(const effect of effects){
  if(effect.screen||effect.bindtime!==-1&&!(effect.bindtime>0)||blocked(effect.player,effect))continue;
  const owner=effect.ownerKey?.startsWith('entity')?entities.find(value=>value.key===effect.ownerKey&&!value.destroyed):root(effect.player);
  if(!owner)continue;
  effect.x=owner.x+(effect.bindOffset?.[0]||0)*owner.facing;
  effect.y=owner.y+(effect.bindOffset?.[1]||0);effect.facing=owner.facing;
  if(effect.bindtime>0)effect.bindtime--;
 }
}
export function foreignFrameResolver(register){
 const cache=new WeakMap();
 return (frames,character)=>{
  let characters=cache.get(frames);if(!characters){characters=new Map();cache.set(frames,characters)}
  if(!characters.has(character))characters.set(character,frames.map(frame=>{const own={...frame};register(own,character);return own}));
  return characters.get(character);
 };
}
