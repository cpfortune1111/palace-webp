export function neutralizeReversedHitDefinition(definition){
 if(!definition?.params)return false;
 definition.params.hitflag='';
 definition.params.hitonce=-1;
 definition.hitOnceSpent=true;
 definition.reversed=true;
 return true;
}
