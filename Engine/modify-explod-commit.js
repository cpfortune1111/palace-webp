export function commitModifyExplodEffects(effects,owner,changes,{modify}){
 for(const effect of effects)modify(effect,owner,changes,'beforeWindow');
 if(changes.windowWrite)for(const effect of effects){effect.window??=[0,0,0,0];changes.windowWrite((axis,value)=>{effect.window[axis]=value})}
 for(const effect of effects)modify(effect,owner,changes,'afterWindow');
}
