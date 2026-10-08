export function createScoreRuntime(){
 const totals=[0,0],roundScores=[0,0],icons=[[],[]],combos=[0,0],finishers=[null,null],streaks=[0,0];let first=false,koTime=0;const hits=[0,0];
 const roundHundred=value=>Math.floor(value/100+.5)*100;
 const comboBonus=count=>count<2?0:count<=14?[0,0,300,500,1000,1200,1500,2000,2300,2600,3000,3300,3600,4000,4500][count]:Math.min(10000,5000+(count-15)*1000);
 function add(player,value){totals[player-1]+=value;roundScores[player-1]+=value}
 function resetRound(){roundScores.fill(0);combos.fill(0);finishers.fill(null);first=false}
 function resetMatch(){totals.fill(0);hits.fill(0);koTime=0;for(const list of icons)list.length=0;resetRound()}
 function endCombo(player){add(player,comboBonus(combos[player-1]));combos[player-1]=0}
 function hit(player,defender,params,result,{platform='snes',commandMode='auto',ai=false}={}){
  const index=player-1,attr=String(params.attr||'').split(',')[1]?.trim().toUpperCase()||'NA';
  if(params.score!==undefined){const values=String(params.score).split(',').map(Number);add(player,values[0]||0);add(player===1?2:1,values[1]||0)}
  else add(player,roundHundred(result.getHit.damage*({N:8,S:6,H:10}[attr[0]]||0)*({snes:1,'3do':1.1,saturn:1.25}[platform]||1)*(attr[0]==='N'||ai||commandMode==='auto'?1:1.2)));
  if(!result.guarded){hits[index]++;if(!first){add(player,1500);first=true}if(defender.moveType==='A')add(player,100);combos[index]++;}
  finishers[index]={type:result.guarded?'c':attr[1]==='T'?'throw':attr[0]==='H'?'h':attr[0]==='S'?'s':'n'};
 }
 function step(firstFighter,secondFighter){for(const [player,defender] of [[1,secondFighter],[2,firstFighter]])if(defender.moveType!=='H'||defender.life<=0)endCombo(player)}
 function finish(winner,reason,life,remaining,total){
  for(const player of [1,2])endCombo(player);if(remaining!==null&&Number.isFinite(total))koTime+=Math.max(0,total-remaining);if(!winner)return;
  const type=reason==='time'?'t':finishers[winner-1]?.type||'suicide',perfect=life[winner-1]>=1000;
  icons[winner-1].push({type,perfect});if(perfect)add(winner,15000);if(type==='h')add(winner,10000);if(type==='s')add(winner,3000);
  const ratio=remaining===null?0:100*remaining/total,multiplier=ratio>90?5:ratio>85?4:ratio>80?2.5:ratio>70?2:ratio>60?1.5:1;
  add(winner,roundHundred(life[winner-1]/1000*10000*multiplier));
 }
 function matchWin(winner,{homeTeam=1,opponentAI=false}={}){if(!winner){streaks.fill(0);return}streaks[winner-1]++;streaks[(winner===1?2:1)-1]=0;if(winner!==homeTeam&&opponentAI)add(winner,30000+(streaks[winner-1]-1)*10000)}
 return {add,hit,step,finish,matchWin,resetRound,resetMatch,comboBonus,snapshot:()=>({totals:[...totals],hits:[...hits],koTime,roundScores:[...roundScores],icons:icons.map(list=>list.map(icon=>({...icon})))})};
}

