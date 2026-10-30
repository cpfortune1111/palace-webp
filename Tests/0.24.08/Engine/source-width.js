// Native Width is a per-tick addition to the character's base front/back size.
export function createSourceWidth(){
 const entries=new Map();
 return {
  set(player,tick,params,evaluate,pair){
   const entry=entries.get(player)?.tick===tick?entries.get(player):{tick};
   for(const key of ['player','edge'])if(params[key]!==undefined)entry[key]=pair(params[key]).map(evaluate);
   if(params.value!==undefined)entry.player=entry.edge=pair(params.value).map(evaluate);
   entries.set(player,entry);
  },
  size(player,tick,facing,front=40,back=40){
   const entry=entries.get(player),add=entry?.tick===tick?entry.player:null;
   const f=Math.max(0,front+(add?.[0]??0)),b=Math.max(0,back+(add?.[1]??0));
   return facing<0?{left:f,right:b}:{left:b,right:f};
  },
  edge(player,tick,facing){
   const entry=entries.get(player),edge=entry?.tick===tick?entry.edge:null;
   return facing<0?{left:edge?.[0]??0,right:edge?.[1]??0,active:!!edge}:{left:edge?.[1]??0,right:edge?.[0]??0,active:!!edge};
  },
  reset(){entries.clear()}
 };
}
