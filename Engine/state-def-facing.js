const present=value=>value!==undefined&&value!==null&&!(typeof value==='string'&&!value.trim());

export function shouldFaceStateOpponent(actor,opponent,{depth=false,worldScale=1,legacyDistance=false}={}){
 if(!opponent)return false;
 let horizontal=Math.fround(Math.fround(opponent.x-actor.x)*(actor.facing??1)/worldScale);
 if(legacyDistance)horizontal=Math.trunc(horizontal);
 if(horizontal<0)return true;
 if(!depth||horizontal!==0)return false;
 const behindDepth=Math.fround(((opponent.z??0)-(actor.z??0))/worldScale)<0;
 return behindDepth===((actor.x??0)*(actor.facing??1)>0);
}

export function applyStateDefFacing(definition,api){
 if(!present(definition?.facep2))return false;
 if(Number(api.evaluate(definition.facep2))===0||api.asserted('nofacep2'))return false;
 const actor=api.actor(),opponent=api.opponent(actor);
 if(!opponent||api.targetAsserted(opponent,'noturntarget'))return false;
 if(!shouldFaceStateOpponent(actor,opponent,api.geometry(actor)))return false;
 api.setFacing(-(actor.facing??1));
 return true;
}
