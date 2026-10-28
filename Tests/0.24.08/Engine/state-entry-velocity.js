// Omitted StateDef velocity components must not overwrite an existing axis.
// Facing is 1 for local velocity bindings, or the actor's facing for world VX.
export function applyStateVelocity(fighter,values,facing=1){
 if(!Array.isArray(values))return;
 if(values[0]!==undefined&&values[0]!==null)fighter.vx=Number(values[0])*facing;
 if(values[1]!==undefined&&values[1]!==null)fighter.vy=Number(values[1]);
}
