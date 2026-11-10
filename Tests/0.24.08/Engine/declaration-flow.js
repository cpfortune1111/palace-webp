export function createDeclarationFlow(api){
 let phase='idle',age=0,ticks=0,player=1,duration=0,cues=[],played=new Set(),result=false,winner=0,order=[1,2],speaker=0;
 function begin(options={}){result=!!options.result;winner=options.winner||0;order=result?(winner?[winner===1?2:1,winner]:[]):[2,1];speaker=0;player=order[0]||0;phase=result?'move':'enter';age=0;ticks=0;prepare()}
 function prepare(){cues=player?api.variant(player).cues:[];duration=Math.max(player?api.variant(player).duration||0:0,...cues.map(cue=>cue.tick+cue.duration));played.clear()}
 function startVoice(){phase='voice';age=0;api.startVoice?.(player);for(const [index,cue] of cues.entries())if(cue.tick===0){played.add(index);api.play(player,cue)}}
 function voice(){for(const [index,cue]of cues.entries())if(age>=cue.tick&&!played.has(index)){played.add(index);api.play(player,cue)}return Math.max(age,api.voiceTick?.(player)||0)>=duration&&!api.playing()}
 function step(){if(phase==='idle'||phase==='done')return;ticks++;age++;if(!result){if(phase==='enter'&&age>=192)startVoice();else if(phase==='voice'&&voice()){if(speaker===order.length-1){phase='vsExit';age=0}else{phase='wait';age=0}}else if(phase==='wait'&&age>=15){speaker++;player=order[speaker];prepare();startVoice()}else if(phase==='vsExit'&&age>=132){phase='done';api.complete()}return}
 if(phase==='enter'&&age>=90){phase='move';age=0}else if(phase==='move'&&age>=30){phase='entryHold';age=0}else if(phase==='entryHold'&&age>=15){if(order.length)startVoice();else{phase='wait';age=0}}else if(phase==='voice'&&voice()){phase='wait';age=0}else if(phase==='wait'&&age>=15){age=0;speaker++;if(speaker<order.length){player=order[speaker];prepare();startVoice()}else phase='loserFade'}else if(phase==='loserFade'&&age>=30){phase='done';api.complete()}}
 function reset(){phase='idle';age=0;ticks=0;played.clear()}
 function fade(){if(!result)return phase==='vsExit'?Math.min(1,Math.max(0,(age-96)/36)):phase==='done'?1:0;return phase==='loserFade'&&!winner?Math.min(1,age/30):0}
 return {begin,step,reset,snapshot:()=>({phase,age,ticks,player,result,winner,vsExitAge:!result?(phase==='vsExit'?age:phase==='done'?132:null):null,movement:result?Math.min(1,Math.max(0,ticks/30)):0,loserOpacity:phase==='done'&&result?0:phase==='loserFade'?Math.max(0,1-age/30):1}),acsOpacity:()=>phase==='idle'?1:Math.max(0,1-ticks/30),fade};
}
