export function createDeclarationFlow(api){
 let phase='idle',age=0,ticks=0,player=1,duration=0,cues=[],played=new Set(),result=false,winner=0,order=[1,2],speaker=0;
 function begin(options={}){result=!!options.result;winner=options.winner||0;order=result?(winner?[winner===1?2:1,winner]:[]):[1,2];speaker=0;player=order[0]||0;phase=result?'enter':'voice';age=0;ticks=0;prepare();if(phase==='voice')startVoice()}
 function prepare(){cues=player?api.variant(player).cues:[];duration=Math.max(0,...cues.map(cue=>cue.tick+cue.duration));played.clear()}
 function startVoice(){phase='voice';age=0;for(const [index,cue] of cues.entries())if(cue.tick===0){played.add(index);api.play(player,cue)}}
 function step(){if(phase==='idle'||phase==='done')return;ticks++;age++;if(phase==='enter'&&age>=90){phase='move';age=0}else if(phase==='move'&&age>=30){if(order.length)startVoice();else{phase='wait';age=0}}else if(phase==='voice'){for(const [index,cue] of cues.entries())if(age>=cue.tick&&!played.has(index)){played.add(index);api.play(player,cue)}if(age>=duration&&!api.playing()){phase='wait';age=0}}else if(phase==='wait'&&age>=60){age=0;speaker++;if(speaker<order.length){player=order[speaker];prepare();startVoice()}else phase=result?'loserFade':'fade'}else if((phase==='fade'||phase==='loserFade')&&age>=30){phase='done';api.complete()}}
 function reset(){phase='idle';age=0;ticks=0;played.clear()}
 return {begin,step,reset,snapshot:()=>({phase,age,ticks,player,result,winner,movement:result?Math.min(1,Math.max(0,(ticks-90)/30)):0,loserOpacity:phase==='loserFade'?Math.max(0,1-age/30):1}),acsOpacity:()=>phase==='idle'?1:Math.max(0,1-ticks/30),fade:()=>phase==='fade'||phase==='loserFade'&&!winner?Math.min(1,age/30):phase==='done'&&!result?1:0};
}

