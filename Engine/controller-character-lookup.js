export function lookupControllerCharacter(id,lookup,disabled=actor=>!!actor.disabled){
 if(id<0)return null;
 const actor=lookup(id);
 return !actor||actor.kind==='projectile'||actor.destroyed||disabled(actor)?null:actor;
}
