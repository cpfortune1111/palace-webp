// Retained entries keep their original object identity and clock bookkeeping.
export function clearActorRegistry(registry,keepKeys){
 if(!keepKeys?.size){registry.clear();return}
 for(const key of registry.keys())if(!keepKeys.has(key))registry.delete(key);
}
