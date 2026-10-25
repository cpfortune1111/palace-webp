export function commitModifyExplodEffects(effects,owner,changes,{modify,finalize}){
 for(const effect of effects)modify(effect,owner,changes,'beforeWindow');
 if(changes.windowWrite)for(const effect of effects){effect.window??=[0,0,0,0];changes.windowWrite((axis,value)=>{effect.window[axis]=value})}
 for(const write of changes.afterImageWrites??[])for(const effect of effects)write(effect);
 for(const effect of effects)modify(effect,owner,changes,'afterWindow');
 if(finalize)for(const effect of effects)finalize(effect,owner,changes);
}
