export function createDeclarationFlow(api){
 let phase='idle',age=0,ticks=0,player=1,duration=0,cues=[],played=new Set();
 function begin(){phase='voice';age=0;ticks=0;player=1;prepare()}
 function prepare(){cues=api.variant(player).cues;duration=Math.max(...cues.map(cue=>cue.tick+cue.duration));played.clear()}
 function step(){if(phase==='idle'||phase==='done')return;ticks++;age++;if(phase==='voice'){for(const [index,cue] of cues.entries())if(age>=cue.tick&&!played.has(index)){played.add(index);api.play(player,cue)}if(age>=duration&&!api.playing()){phase='wait';age=0}}else if(phase==='wait'&&age>=90){age=0;if(player===1){player=2;phase='voice';prepare()}else phase='fade'}else if(phase==='fade'&&age>=30){phase='done';api.complete()}}
 function reset(){phase='idle';age=0;ticks=0;played.clear()}
 return {begin,step,reset,snapshot:()=>({phase,age,ticks,player}),acsOpacity:()=>phase==='idle'?1:Math.max(0,1-ticks/30),fade:()=>phase==='fade'?Math.min(1,age/30):phase==='done'?1:0};
}

