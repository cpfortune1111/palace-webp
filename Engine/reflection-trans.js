export function reflectionTransState(state,intensity,air={type:'none',alpha:[255,0]}){
 const base=!state||state.type==='default'?air:state;
 const amount=Math.trunc(intensity);
 return {type:base.type==='sub'?'sub':'add',alpha:[Math.trunc(base.alpha[0]*amount/255),255-Math.trunc((255-base.alpha[1])*amount/255)]};
}