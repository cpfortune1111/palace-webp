export function stepEnvShake(state){
 if(state.remaining<=0)return {offset:[0,0],finished:true};
 const params=state.params,elapsed=Math.fround(state.age),frequency=Math.fround(params.freq),phase=Math.fround(Math.fround(params.phase)+Math.fround(frequency*elapsed)),direction=Math.fround(Math.fround(params.dir??0)+Math.fround(Math.fround(params.diradd??0)*elapsed));
 let factor=1;
 if(params.mul!==0&&params.mul!==1)factor*=Math.pow(params.mul,Math.floor(Math.fround(frequency*elapsed)/360));
 const ratio=state.remaining/(state.remaining+state.age);
 if(params.decay!==0&&ratio>0)factor*=Math.pow(ratio,params.decay??0);
 const amplitude=params.ampl*factor,amount=amplitude*Math.sin(phase*Math.PI/180),angle=direction*Math.PI/180;
 const offset=amplitude===0?[0,0]:[Math.fround(amount*Math.sin(-angle)),Math.fround(amount*Math.cos(-angle))];
 state.age++;state.remaining--;
 return {offset,finished:false};
}
