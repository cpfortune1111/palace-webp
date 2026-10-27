export function applyModifiedRemovalTime(effect,value,ikemen){
 effect.removetime=ikemen&&value>0?((effect.age|0)+value)|0:value;
 effect.nativeRemoveTime=true;
}

export function modifiedExplodExpired(effect,duration){
 if(effect.removetime>=0)return effect.age>=effect.removetime;
 return effect.removetime<=-2&&effect.age>=duration;
}

export function applyModifiedPauseTimes(effect,values,ikemen){
 for(const name of ['supermovetime','pausemovetime'])if(values[name]!==undefined)effect[name]=ikemen&&values[name]>0?((effect.age|0)+values[name])|0:values[name];
 effect.nativePauseTime=true;
}

export function modifiedExplodSystemPaused(effect,pauses,tick){
 const slot=pauses.super.some(pause=>pause?.remaining>0)?'super':'normal';
 if(!pauses[slot].some(pause=>pause?.remaining>0&&pause.created!==tick))return false;
 const allowance=effect[slot==='super'?'supermovetime':'pausemovetime']??0;
 return allowance>=0&&effect.age>=allowance||allowance< -2;
}
